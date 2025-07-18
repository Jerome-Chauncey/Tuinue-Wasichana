from email_service import send_email

# Replace this with your own email if using a real SMTP service
test_recipient = "test@example.com"

send_email(
    to_email=test_recipient,
    subject="Test Email from Tuinue Wasichana",
    content="This is a test email to confirm that Mailtrap integration is working!"
)
