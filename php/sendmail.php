<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars(trim($_POST['name']));
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars(trim($_POST['message']));

    if (empty($name) || empty($email) || empty($message)) {
        echo "error"; // changed
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "error"; // changed
        exit;
    }

    $to = "eoricogonzales@gmail.com";
    $subject = "Message from MAMBA Portfolio Website";
    $body = "You have received a new message from your portfolio website.\n\n" .
            "Name: $name\n" .
            "Email: $email\n\n" .
            "Message:\n$message";

    $header = "From: $email\r\n";
    $header .= "Reply-To: $email\r\n";

    if (mail($to, $subject, $body, $header)) {
        echo "success"; // changed
    } else {
        echo "error"; // changed
    }
} else {
    echo "error"; // changed
    exit;
}
?>
