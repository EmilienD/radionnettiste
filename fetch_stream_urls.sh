#! /bin/bash

# Fetches the current RTL stream url and prints the list of streams,
# with the RTL entry pointing to it.
# Usage: ./fetch_stream_url.sh [stream-list.txt] > stream-list-live.txt

echoerr() { echo "$@" 1>&2; }

RTL=""
if command -v jq >/dev/null 2>&1; then
  RTL=$(curl 'https://www.rtl.fr/ws/live/live' \
  --compressed \
  -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:161.0) Gecko/20100101 Firefox/161.0' \
  -H 'Accept: */*' \
  -H 'Accept-Language: en,fr;q=0.9' \
  -H 'Accept-Encoding: gzip, deflate, br, zstd' \
  -H 'Referer: https://www.rtl.fr/' \
  -H 'Sec-GPC: 1' \
  -H 'Connection: keep-alive' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'Priority: u=0' \
  -H 'TE: trailers' 2> /dev/null | jq -r .audio.path)
  if [[ ! ${RTL} ]]; then
    echoerr "Could not fetch the RTL stream url"
  fi
else
  echoerr "jq is not installed, cannot fetch the RTL stream url"
fi

# copy the stream list and point the RTL entry to the url fetched above
# (when the url could not be fetched, the entry is left untouched)
awk -v url="${RTL}" -F ';' 'BEGIN {OFS = ";"} $1 == "RTL" && url != "" {$2 = url} {print}' \
  "${1:-stream-list.txt}"
