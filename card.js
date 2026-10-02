const params =
    new URLSearchParams(window.location.search);

const slug =
    params.get("slug");


const loading =
    document.getElementById("loading");

const profileCard =
    document.getElementById("profileCard");


// ========================================
// HELPER
// ========================================

function setLink(id, value, prefix = "") {

    const element =
        document.getElementById(id);

    if (!value) {

        element.style.display = "none";

        return;

    }

    element.href =
        prefix + value;

}


// ========================================
// LOAD PROFILE
// ========================================

async function loadCard() {

    if (!slug) {

        loading.textContent =
            "Card not found.";

        return;

    }


    const { data, error } =
        await supabaseClient
            .from("profiles")
            .select("*")
            .eq("slug", slug)
            .eq("is_published", true)
            .maybeSingle();


    if (error) {

        console.error(error);

        loading.textContent =
            "Unable to load card.";

        return;

    }


    if (!data) {

        loading.textContent =
            "This digital card does not exist.";

        return;

    }


    document.title =
        `${data.full_name} | Digital Card`;


    // IMAGE

    const image =
        document.getElementById("profileImage");

    if (data.profile_image) {

        image.src =
            data.profile_image;

    } else {

        image.style.display =
            "none";

    }


    // BASIC INFO

    document.getElementById("fullName").textContent =
        data.full_name || "";

    document.getElementById("jobTitle").textContent =
        data.job_title || "";

    document.getElementById("company").textContent =
        data.company || "";

    document.getElementById("bio").textContent =
        data.bio || "";


    // CONTACT

    setLink(
        "callBtn",
        data.phone,
        "tel:"
    );


    let whatsapp =
        data.whatsapp || data.phone || "";


    whatsapp =
        whatsapp.replace(/\D/g, "");


    setLink(
        "whatsappBtn",
        whatsapp,
        "https://wa.me/"
    );


    setLink(
        "emailBtn",
        data.email,
        "mailto:"
    );


    // WEBSITE

    const websiteRow =
        document.getElementById("websiteRow");

    if (data.website) {

        document.getElementById("website").href =
            data.website.startsWith("http")
                ? data.website
                : `https://${data.website}`;

    } else {

        websiteRow.style.display = "none";

    }


    // LOCATION

    if (data.location) {

        document.getElementById("location").textContent =
            data.location;

    } else {

        document.getElementById("locationRow")
            .style.display = "none";

    }


    // SERVICES

    if (data.services) {

        document.getElementById("services").textContent =
            data.services;

    } else {

        document.getElementById("servicesSection")
            .style.display = "none";

    }


    // SOCIALS

    setupSocial(
        "instagram",
        data.instagram,
        "https://instagram.com/"
    );

    setupSocial(
        "facebook",
        data.facebook
    );

    setupSocial(
        "linkedin",
        data.linkedin
    );

    setupSocial(
        "tiktok",
        data.tiktok,
        "https://tiktok.com/@"
    );


    // QR CODE

    const qr =
        document.getElementById("qrcode");

    qr.innerHTML = "";

    new QRCode(qr, {

        text: window.location.href,

        width: 150,

        height: 150,

        colorDark: "#000000",

        colorLight: "#ffffff",

        correctLevel:
            QRCode.CorrectLevel.H

    });


    // SHOW

    loading.style.display =
        "none";

    profileCard.style.display =
        "block";


    // SAVE CONTACT

    document
        .getElementById("saveContact")
        .addEventListener("click", function() {

            saveContact(data);

        });

}


// ========================================
// SOCIAL HELPER
// ========================================

function setupSocial(id, value, prefix = "") {

    const element =
        document.getElementById(id);


    if (!value) {

        element.style.display =
            "none";

        return;

    }


    if (
        value.startsWith("http://") ||
        value.startsWith("https://")
    ) {

        element.href =
            value;

    } else {

        element.href =
            prefix + value.replace("@", "");

    }

}


// ========================================
// SAVE CONTACT
// ========================================

function saveContact(data) {

    const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${data.full_name || ""}
ORG:${data.company || ""}
TITLE:${data.job_title || ""}
TEL:${data.phone || ""}
EMAIL:${data.email || ""}
URL:${data.website || ""}
ADR:;;${data.location || ""};;;;
NOTE:${data.bio || ""}
END:VCARD
`;


    const blob =
        new Blob(
            [vcard],
            { type: "text/vcard" }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");

    link.href =
        url;

    link.download =
        `${data.full_name || "contact"}.vcf`;

    link.click();


    URL.revokeObjectURL(url);

}


// ========================================
// START
// ========================================

loadCard();