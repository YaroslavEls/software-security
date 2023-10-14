domain="dev-qb10xp3grlv3s3hq.us.auth0.com"
audience="https://$domain/api/v2/"
grant_type="client_credentials"
client_id="rGVZAT0Dzufv4iM8MjROEuDNTCBatp3s"
client_secret="_b0M4PReJ-5PcwaEohB31Y7b_U20ZhO51x98oHMZsGOSyEOi7PtelLmrRk7Tooyv"

curl --request POST \
  --url "https://$domain/oauth/token" \
  --header "content-type: application/x-www-form-urlencoded" \
  --data "audience=$audience&grant_type=$grant_type&client_id=$client_id&client_secret=$client_secret"
