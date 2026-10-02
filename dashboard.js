let currentUser = null;
let existingProfile = null;


// ========================================
// CHECK LOGIN
// ========================================

async function checkUser() {

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    if (!user) {

        window.location.href = "login.html";

        return null;
    }

    currentUser = user;

    return user;
}


// ========================================
// CREATE SLUG
// ========================================

function createSlug(value) {

    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}


// ========================================
// AUTO SLUG
// ========================================

document
    .getElementById("fullName")
    .addEventListener("input", function() {

        const slugInput =
            document.getElementById("slug");

        if (!slugInput.dataset.edited) {

            slugInput.value =
                createSlug(this.value);

        }

    });


document
    .getElementById("slug")
    .addEventListener("input", function() {

        this.dataset.edited = "true";

        this.value =
            createSlug(this.value);

    });


// ========================================
// LOAD EXISTING PROFILE
// ========================================

async function loadProfile() {

    const { data, error } =
        await supabaseClient
            .from("profiles")
            .select("*")
            .eq("user_id", currentUser.id)
            .limit(1)
            .maybeSingle();

    if (error) {

        console.error(error);

        return;
    }

    if (!data) return;

    existingProfile = data;


    document.getElementById("fullName").value =
        data.full_name || "";

    document.getElementById("jobTitle").value =
        data.job_title || "";

    document.getElementById("company").value =
        data.company || "";

    document.getElementById("bio").value =
        data.bio || "";

    document.getElementById("phone").value =
        data.phone || "";

    document.getElementById("whatsapp").value =
        data.whatsapp || "";

    document.getElementById("email").value =
        data.email || "";

    document.getElementById("website").value =
        data.website || "";

    document.getElementById("instagram").value =
        data.instagram || "";

    document.getElementById("facebook").value =
        data.facebook || "";

    document.getElementById("linkedin").value =
        data.linkedin || "";

    document.getElementById("tiktok").value =
        data.tiktok || "";

    document.getElementById("location").value =
        data.location || "";

    document.getElementById("services").value =
        data.services || "";

    document.getElementById("slug").value =
        data.slug || "";

    document
        .getElementById("slug")
        .dataset.edited = "true";
}


// ========================================
// IMAGE UPLOAD
// ========================================

async function uploadProfileImage(file) {

    if (!file) return null;

    const extension =
        file.name.split(".").pop().toLowerCase();

    const fileName =
        `${crypto.randomUUID()}.${extension}`;

    const filePath =
        `${currentUser.id}/${fileName}`;


    const { error } =
        await supabaseClient
            .storage
            .from("avatars")
            .upload(filePath, file, {
                upsert: false,
                contentType: file.type
            });


    if (error) {

        throw error;

    }


    const {
        data
    } =
        supabaseClient
            .storage
            .from("avatars")
            .getPublicUrl(filePath);


    return data.publicUrl;
}


// ========================================
// SAVE CARD
// ========================================

document
    .getElementById("cardForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const message =
            document.getElementById("dashboardMessage");

        message.textContent =
            "Saving your digital card...";


        try {

            const imageFile =
                document.getElementById("profileImage").files[0];


            let profileImage =
                existingProfile?.profile_image || null;


            if (imageFile) {

                if (imageFile.size > 6 * 1024 * 1024) {

                    throw new Error(
                        "Profile image must be 6MB or smaller."
                    );

                }

                profileImage =
                    await uploadProfileImage(imageFile);
            }


            const profileData = {

                user_id: currentUser.id,

                slug:
                    document.getElementById("slug").value.trim(),

                full_name:
                    document.getElementById("fullName").value.trim(),

                job_title:
                    document.getElementById("jobTitle").value.trim(),

                company:
                    document.getElementById("company").value.trim(),

                bio:
                    document.getElementById("bio").value.trim(),

                phone:
                    document.getElementById("phone").value.trim(),

                whatsapp:
                    document.getElementById("whatsapp").value.trim(),

                email:
                    document.getElementById("email").value.trim(),

                website:
                    document.getElementById("website").value.trim(),

                instagram:
                    document.getElementById("instagram").value.trim(),

                facebook:
                    document.getElementById("facebook").value.trim(),

                linkedin:
                    document.getElementById("linkedin").value.trim(),

                tiktok:
                    document.getElementById("tiktok").value.trim(),

                location:
                    document.getElementById("location").value.trim(),

                services:
                    document.getElementById("services").value.trim(),

                profile_image:
                    profileImage,

                template:
                    "dark-premium",

                is_published:
                    true
            };


            let result;


            if (existingProfile) {

                result =
                    await supabaseClient
                        .from("profiles")
                        .update(profileData)
                        .eq("id", existingProfile.id)
                        .select()
                        .single();

            } else {

                result =
                    await supabaseClient
                        .from("profiles")
                        .insert(profileData)
                        .select()
                        .single();

            }


            if (result.error) {

                throw result.error;

            }


            existingProfile =
                result.data;


            message.textContent =
                "Card saved successfully!";


            setTimeout(() => {

                window.location.href =
                    `card.html?slug=${encodeURIComponent(result.data.slug)}`;

            }, 1000);


        } catch (error) {

            console.error(error);

            message.textContent =
                error.message || "Something went wrong.";

        }

    });


// ========================================
// LOGOUT
// ========================================

document
    .getElementById("logoutBtn")
    .addEventListener("click", async function() {

        await supabaseClient.auth.signOut();

        window.location.href = "login.html";

    });


// ========================================
// START
// ========================================

(async function() {

    const user =
        await checkUser();

    if (user) {

        await loadProfile();

    }

})();