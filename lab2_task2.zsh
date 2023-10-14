domain="dev-qb10xp3grlv3s3hq.us.auth0.com"
token="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ikhoc0o4cDdIZGdBTXlGQjc5X0NqeSJ9.eyJpc3MiOiJodHRwczovL2Rldi1xYjEweHAzZ3JsdjNzM2hxLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJyR1ZaQVQwRHp1ZnY0aU04TWpST0V1RE5UQ0JhdHAzc0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9kZXYtcWIxMHhwM2dybHYzczNocS51cy5hdXRoMC5jb20vYXBpL3YyLyIsImlhdCI6MTY5NzI1MDc2NCwiZXhwIjoxNjk3MzM3MTY0LCJhenAiOiJyR1ZaQVQwRHp1ZnY0aU04TWpST0V1RE5UQ0JhdHAzcyIsInNjb3BlIjoicmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.L2elDyuLYeugGGygYb2YHUG42egDp1Nx7y-xEj3IuGRXe8AGPlf_DQBUCUJkgLNUjjD4aIHgSZ4efU5VuAMPBG9OGKp3ymSK89TRy_MPAUdhAUFB3peFiay693zOR3JxQYw0d8W2meQX3HrIfaJOi3IM-QQ5btoQLQBq2RK1rr48B1gIRA-IGSpvpVPxOJRPYVwFJlgtAlYKYjBeldpXV-HmOAkUrQqIsek_X-sdFCaClcgLWvQECFsXukJfPe_KQIsHn3nl5pI0CZJ-SXyv5sy6C54sjr_LxgLZLGveQ851IA55cZoFUrSebBRd_IVAS64RtVMm3tadITTr0sN0sA"

curl --request POST \
  --url "https://$domain/api/v2/users" \
  --header 'content-type: application/json' \
  --header "authorization: Bearer $token" \
  --data '{ 
    "email": "username2@example.com",
    "password": "Password123",
    "connection": "Username-Password-Authentication"
}'
