function shareCard() {

    if (navigator.share) {

        navigator.share({
            title: "Mozz Elly | Digital Business Card",
            text: "Connect with Mozz Elly",
            url: window.location.href
        });

    } else {

        alert("Copy this page link and share it.");

    }
}


function saveContact() {

    const vCard = `
BEGIN:VCARD
VERSION:3.0
FN:Mozz Elly
ORG:Mkombozi Digital
TITLE:Creative & Digital Marketing Specialist
TEL:+255700000000
EMAIL:hello@example.com
URL:https://example.com
ADR:;;Dar es Salaam;;;Tanzania
END:VCARD
`;

    const blob = new Blob(
        [vCard],
        { type: "text/vcard" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "Mozz-Elly.vcf";

    link.click();

    URL.revokeObjectURL(url);
}