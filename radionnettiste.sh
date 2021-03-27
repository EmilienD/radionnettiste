#! /bin/bash

# This program could open a playlist file (.m3u) and use DBus to control vlc.
# (see https://wiki.videolan.org/DBus/)
# Using this technique would remove the waiting time when switching between
# streams.
# But quid of handling vlc crashes? Do streams that are not currently playing
# still consume resources? Would that amount to a huge amount of data if the
# radio stays on most of the time (which would be necessary to enjoy the
# shorter transition time)?

PAGE_UP=$'\e[5~'
PAGE_DOWN=$'\e[6~'
NEXT=NEXT
PREVIOUS=PREVIOUS
PAUSE=PAUSE

echoerr() { echo "$@" 1>&2; }

function detect_command() {
  read -rn4 ans
  read -t 0.5 -rn4 dbl_click
  if [[ $dbl_click ]]; then
    printf "%s" $PAUSE
  else
    case $ans in
    "${PAGE_UP}")
      printf "%s" $NEXT
      ;;
    "${PAGE_DOWN}")
      printf "%s" $PREVIOUS
      ;;
    esac
  fi
}

function main() {
  local stream_file=$1
  if [[ ! $stream_file ]]; then
    echoerr "Invalid argument: Missing file with list of streams"
    exit 22
  fi
  readonly stream_file
  local line_num=1
  local line_count
  line_count=$(wc -l "${stream_file}" | awk '{print $1;}')
  readonly line_count
  if [[ "1" -gt ${line_count} ]]; then
    echoerr "Invalid argument: file appears to be empty or missing"
    exit 22
  fi
  local is_paused=$FALSE
  while true; do
    trap 'kill ${fridge_process} && exit' 2
    # kill the current radio if there is one
    if [[ $fridge_process ]]; then
      kill "${fridge_process}"
      fridge_process=""
    fi
    # read name and url from line in file, announce and play radio in background
    stream_args=$(sed "${line_num}q;d" "${stream_file}")
    radio_name="$(echo "${stream_args}" | awk '{$NF=""; print $0;}')"
    radio_link="$(echo "${stream_args}" | awk '{print $NF;}')"
    if [[ ! $is_paused ]]; then
      cvlc "${radio_link}" 2>/dev/null >/dev/null &
      # save the pid of vlc to kill it when going to the next radio
      fridge_process=$!
    fi
    if [[ $is_paused ]]; then
      espeak -v french "En pause sur ${radio_name}."
    else
      espeak -v french "${radio_name}."
    fi
    # wait for input
    local ans
    ans=$(detect_command)
    case $ans in
    "${NEXT}")
      line_num=$((line_num % line_count))
      line_num=$((line_num + 1))
      ;;
    "${PREVIOUS}")
      line_num=$((line_num - 1))
      if [[ 1 -gt "${line_num}" ]]; then
        line_num=${line_count}
      fi
      ;;
    "${PAUSE}")
      if [[ $is_paused ]]; then is_paused=""; else is_paused=1; fi
      ;;
    esac
  done
}

main "${1}"
