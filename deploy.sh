gsutil cp web/* "gs://quinnftw.com/wordle"
gsutil acl ch -r -u AllUsers:R "gs://quinnftw.com/wordle"
