domain="dev-qb10xp3grlv3s3hq.us.auth0.com"

curl --request POST \
  --url "https://$domain/oauth/token" \
  --header "content-type: application/x-www-form-urlencoded" \
  --data "grant_type=refresh_token" \
  --data "client_id=rGVZAT0Dzufv4iM8MjROEuDNTCBatp3s" \
  --data "client_secret=_b0M4PReJ-5PcwaEohB31Y7b_U20ZhO51x98oHMZsGOSyEOi7PtelLmrRk7Tooyv" \
  --data "refresh_token=YvXeL1BQ5GVx21IubsDq_FKYvAqHhrXdhxE_vQiTaUCLf"
