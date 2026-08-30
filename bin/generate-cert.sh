#!/usr/bin/env bash

set -euo pipefail

if ! command -v openssl > /dev/null 2>&1; then
  echo 'OpenSSL is required to generate the development certificate.' >&2
  exit 1
fi

script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
project_root=$(cd -- "$script_dir/.." && pwd)
certificate_path="${CERT_PATH:-$project_root/cert/dev-cert.pem}"
private_key_path="${KEY_PATH:-$project_root/cert/dev-key.pem}"
validity_days="${CERT_DAYS:-3653}"
certificate_subject="${CERT_SUBJECT:-/CN=localhost}"
subject_alt_names="${CERT_SAN:-DNS:localhost,IP:127.0.0.1,IP:::1}"
key_type="${CERT_KEY_TYPE:-rsa:2048}"
tmp_dir=$(mktemp -d)

trap 'rm -rf "$tmp_dir"' EXIT

mkdir -p "$(dirname "$certificate_path")" "$(dirname "$private_key_path")"

openssl req "$@" -x509 -newkey "$key_type" -sha256 -nodes \
  -keyout "$tmp_dir/dev-key.pem" \
  -out "$tmp_dir/dev-cert.pem" \
  -days "$validity_days" \
  -subj "$certificate_subject" \
  -addext "subjectAltName=$subject_alt_names"

chmod 600 "$tmp_dir/dev-key.pem"
mv "$tmp_dir/dev-key.pem" "$private_key_path"
mv "$tmp_dir/dev-cert.pem" "$certificate_path"

printf 'Generated %s and %s\n' "$certificate_path" "$private_key_path"
