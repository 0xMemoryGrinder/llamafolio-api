#!/usr/bin/env bash

set -eou pipefail

# This script is used to check against lambda endpoints to ensure they are working as expected.

curl --head \
  --request GET \
  --silent \
  --show-error \
  --fail \
  --url $API_URL/adapters

curl --head \
  --request GET \
  --silent \
  --show-error \
  --fail \
  --url $API_URL/balances/0xbDfA4f4492dD7b7Cf211209C4791AF8d52BF5c50

curl --head \
  --request GET \
  --silent \
  --show-error \
  --fail \
  --url $API_URL/balances/0xbDfA4f4492dD7b7Cf211209C4791AF8d52BF5c50/latest

curl --head \
  --request GET \
  --silent \
  --show-error \
  --fail \
  --url $API_URL/balances/0xbDfA4f4492dD7b7Cf211209C4791AF8d52BF5c50/tokens

curl --head \
  --request GET \
  --silent \
  --show-error \
  --fail \
  --url $API_URL/contracts/0x0d8775f648430679a709e98d2b0cb6250d2887ef

curl --head \
  --request GET \
  --silent \
  --show-error \
  --fail \
  --url $API_URL/history/0xbDfA4f4492dD7b7Cf211209C4791AF8d52BF5c50

curl --head \
  --request GET \
  --silent \
  --show-error \
  --fail \
  --url $API_URL/info/stats

curl --head \
  --request GET \
  --silent \
  --show-error \
  --fail \
  --url $API_URL/info/0xbDfA4f4492dD7b7Cf211209C4791AF8d52BF5c50

curl --head \
  --request GET \
  --silent \
  --show-error \
  --fail \
  --url $API_URL/labels/0xbDfA4f4492dD7b7Cf211209C4791AF8d52BF5c50

curl --head \
  --request GET \
  --silent \
  --show-error \
  --fail \
  --url $API_URL/protocols

curl --head \
  --request GET \
  --silent \
  --show-error \
  --fail \
  --url $API_URL/protocols/latest

curl --head \
  --request GET \
  --silent \
  --show-error \
  --fail \
  --url $API_URL/snapshots/0xbDfA4f4492dD7b7Cf211209C4791AF8d52BF5c50/latest

curl --head \
  --request GET \
  --silent \
  --show-error \
  --fail \
  --url $API_URL/sync_status

curl --head \
  --request GET \
  --silent \
  --show-error \
  --fail \
  --url $API_URL/tokens/0xbDfA4f4492dD7b7Cf211209C4791AF8d52BF5c50

curl --head \
  --request GET \
  --silent \
  --show-error \
  --fail \
  --url $API_URL/tokens/ethereum/0x6b175474e89094c44da98b954eedeac495271d0f

curl --head \
  --request GET \
  --silent \
  --show-error \
  --fail \
  --url $API_URL/holders/0x6b175474e89094c44da98b954eedeac495271d0f

curl --head \
  --request GET \
  --silent \
  --show-error \
  --fail \
  --url $CLOUDFLARE_R2_PUBLIC_URL/nft/llama_nft_collections.json