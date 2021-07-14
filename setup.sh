#!/usr/bin/env bash

dpkg --add-architecture i386
apt update
apt install wine64 wine32