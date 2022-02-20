# Radionnettiste

This project "emulates" a traditional fm radio.
It works as a "carousel", where the only commands are previous and next radio in a circular list.
It uses VLC to access the web radio streams of a select few stations.
The code base also contains a first attempt using puppeteer which turned out to be much too slow
and unstable to be useful.

## Install

The program is a bash script, and needs VLC installed

## Start

`./radionnetiste.sh stream-list.txt`

## Motivation

This project is intended to allow my dad and his wife to listen to the radios they can not receive via fm frequencies, on a Raspberry Pi with no screen and a simple interface with only a page up and down button.
