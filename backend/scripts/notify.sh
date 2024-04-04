# Define los datos necesarios
MESSAGE='{"text": "Este es un mensaje de prueba."}'
SPACE_ID="AAAAzglVlfY"
KEY="AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI"
TOKEN="rwfgCvPgWU4PB8MwFMjoV-9sMOYdppgDBhhxYS41uOQ"

# Envía el mensaje a Google Chat
curl -X POST \
  -H "Content-Type: application/json; charset=UTF-8" \
  -d "$MESSAGE" \
  "https://chat.googleapis.com/v1/spaces/$SPACE_ID/messages?key=$KEY&token=$TOKEN"