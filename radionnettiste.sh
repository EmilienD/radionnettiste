#!/bin/bash

# TODO: pause on double click
# maybe algo:
# 1. read var1
# 2. read var2 in backgroung
# 3. sleep 0.5
# 4. if var2 is not null, double click
# 5. change var1 to reflect double click
# 6. reset var2

PAGE_UP=$'\e[5~'
PAGE_DOWN=$'\e[6~'

function main() {
  stream_file=$1
  readonly stream_file
  line_num=1
  line_count=$(wc -l "${stream_file}" | awk '{print $1;}')
  readonly line_count
  while true; do
    trap 'kill ${fridge_process} && exit' 2
    # kill the current radio if there is one
    if [[ -v fridge_process ]]; then
      kill "${fridge_process}"
    fi
    # read name and url from line in file, announce and play radio in background
    stream_args=$(sed "${line_num}q;d" "${stream_file}")
    radio_name="$(echo "${stream_args}" | awk '{$NF=""; print $0;}')"
    radio_link="$(echo "${stream_args}" | awk '{print $NF;}')"
    espeak -v french "${radio_name}"
    cvlc "${radio_link}" 2>/dev/null >/dev/null &
    # save the pid of vlc to kill it when going to the next radio
    fridge_process=$!
    # wait for page up or down
    read -rn4 ans
    case $ans in
    "${PAGE_UP}")
      line_num=$((line_num % line_count))
      line_num=$((line_num + 1))
      ;;
    "${PAGE_DOWN}")
      line_num=$((line_num - 1))
      if [[ 1 -gt "${line_num}" ]]; then
        line_num=${line_count}
      fi
      ;;
    esac
  done
}

main "${1}"
