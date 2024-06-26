import { fetchForm } from "../utils/fetch.js";

// ===== DOM Elements =====
const $postTitleField = document.getElementById("post-title");
const $postContentsField = document.getElementById("post-contents");
const $postImageField = document.getElementById("post-image");
const $postImagePreviewField = document.getElementById("post-image-preview");

const $postHelper = document.getElementById("post-helper");
const $postSubmitBtn = document.getElementById("post-submit-btn");

// ===== FUNCTIONS =====
let postTitleValid, postContentsValid;

$postTitleField.addEventListener("input", () => {
    const postTitle = $postTitleField.value;
    if (postTitle.length === 0) {
        postTitleValid = false;
    } else {
        postTitleValid = true;
    }
    updateButtonStyle();
});

$postContentsField.addEventListener("input", () => {
    const postContents = $postContentsField.value;
    if (postContents.length === 0) {
        postContentsValid = false;
    } else {
        postContentsValid = true;
    }
    updateButtonStyle();
});

$postImageField.addEventListener("change", (e) => {
    const image = e.target.files[0];
    if (!image) {
        $postImagePreviewField.src = "";
        return;
    } else {
        $postImagePreviewField.src = URL.createObjectURL(image);
    }
});

$postSubmitBtn.addEventListener("click", async () => {
    if (!postTitleValid | !postContentsValid) {
        $postHelper.textContent = "*제목과 내용을 모두 입력해주세요.";
        return;
    }

    const formData = new FormData();
    formData.append("title", $postTitleField.value);
    formData.append("content", $postContentsField.value);
    formData.append("image", $postImageField.files[0]);

    await fetchForm("/posts/new", "POST", formData)
        .then((res) => {
            if (res.status === 200) {
                return res.json();
            } else if (res.status === 401) {
                alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
                location.href = "/signin";
            } else if (res.status === 400) {
                alert("게시글 작성에 실패했습니다. 다시 시도해주세요.");
                location.reload();
            }
        })
        .then((data) => {
            alert("게시글이 작성되었습니다.");
            location.href = `/post/${data.post_id}`;
        })
        .catch((error) => {
            console.error("게시글 작성 중 에러 발생: ", error);
        });
});

function updateButtonStyle() {
    if (postTitleValid && postContentsValid) {
        $postHelper.textContent = "";
        $postSubmitBtn.style.backgroundColor = "#7F6AEE";
        $postSubmitBtn.style.cursor = "pointer";
    } else {
        $postSubmitBtn.style.backgroundColor = "#ACA0EB";
        $postSubmitBtn.style.cursor = "";
    }
}
