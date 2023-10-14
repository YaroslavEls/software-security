domain="dev-qb10xp3grlv3s3hq.us.auth0.com"

curl --request POST \
  --url "https://$domain/oauth/token" \
  --header "content-type: application/x-www-form-urlencoded" \
  --data "grant_type=password" \
  --data "username=username1@example.com" \
  --data "password=Password1" \
  --data "client_id=rGVZAT0Dzufv4iM8MjROEuDNTCBatp3s" \
  --data "client_secret=_b0M4PReJ-5PcwaEohB31Y7b_U20ZhO51x98oHMZsGOSyEOi7PtelLmrRk7Tooyv" \
  --data "scope=offline_access"
