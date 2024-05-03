/* json 파일의 데이터에 직접 접근해서 CRUD 하는 파일 */

import fs from "fs";
import path from "path";
import getKoreanDateTime from "../utils/dateFormat.js";

const __dirname = path.resolve();
let postsJSON;

// ===== POSTS =====

const getPosts = () => {
    postsJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data", "posts.json"), "utf-8"),
    );
    return postsJSON;
};

const getPostById = (post_id) => {
    postsJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data", "posts.json"), "utf-8"),
    );
    const usersJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data", "users.json"), "utf-8"),
    );

    // 게시글 정보, 작성자 닉네임, 작성자 프로필 이미지 결합하여 반환
    const post = postsJSON.find((post) => post.post_id === parseInt(post_id));
    const nickname = usersJSON.find(
        (user) => user.user_id === post.user_id,
    ).nickname;
    const profile_image = usersJSON.find(
        (user) => user.user_id === post.user_id,
    ).profile_image;

    return { ...post, nickname, profile_image };
};

const createPost = ({ user_id, post }) => {
    postsJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data", "posts.json"), "utf-8"),
    );

    if (!post.title || !post.content || !user_id) {
        return "error: 필수 속성 누락";
    }

    const post_id = postsJSON.length + 1;
    const datetime = getKoreanDateTime();

    const newPost = {
        post_id: post_id,
        title: post.title,
        content: post.content,
        image: post.image,
        user_id: parseInt(user_id),
        created_at: datetime,
        updated_at: null,
        deleted_at: null,
        likes: 0,
        comments: 0,
        hits: 0,
        comments_list: [],
    };

    postsJSON.push(newPost);
    savePosts();

    return newPost;
};

const updatePost = ({ user_id, post_id, update_form }) => {
    postsJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data", "posts.json"), "utf-8"),
    );

    const postToUpdate = postsJSON.find(
        (post) => post.post_id === parseInt(post_id),
    );
    if (!postToUpdate) {
        return "error: 존재하지 않는 게시글";
    } else if (postToUpdate.user_id !== parseInt(user_id)) {
        return "error: 게시글 수정 권한 없음";
    }

    Object.keys(update_form).forEach((key) => {
        postToUpdate[key] = update_form[key];
    });

    postToUpdate.updated_at = getKoreanDateTime();
    savePosts();

    return postToUpdate;
};

const deletePost = ({ user_id, post_id }) => {
    postsJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data", "posts.json"), "utf-8"),
    );

    const postToDelete = postsJSON.find(
        (post) => post.post_id === parseInt(post_id),
    );

    if (!postToDelete) {
        return "error: 존재하지 않는 게시글";
    } else if (postToDelete.user_id !== parseInt(user_id)) {
        return "error: 게시글 삭제 권한 없음";
    }

    postsJSON = postsJSON.filter((post) => post.post_id !== parseInt(post_id));
    savePosts();

    return "success: 게시글 삭제 성공";
};

// ===== COMMENTS =====

const createComment = ({ user_id, post_id, comment }) => {
    postsJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data", "posts.json"), "utf-8"),
    );

    const postToUpdate = postsJSON.find(
        (post) => post.post_id === parseInt(post_id),
    );
    if (!postToUpdate) {
        return "error: 존재하지 않는 게시글";
    }

    const comment_id = postToUpdate.comments_list.length + 1;
    const datetime = getKoreanDateTime();

    const newComment = {
        comment_id: comment_id,
        content: comment.content,
        user_id: parseInt(user_id),
        created_at: datetime,
        updated_at: null,
    };

    postToUpdate.comments_list.push(newComment);
    postToUpdate.comments += 1;
    savePosts();

    return newComment;
};

const updateComment = ({ user_id, post_id, comment_id, update_form }) => {
    postsJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data", "posts.json"), "utf-8"),
    );

    const postToUpdate = postsJSON.find(
        (post) => post.post_id === parseInt(post_id),
    );
    const commentToUpdate = postToUpdate.comments_list.find(
        (comment) => comment.comment_id === parseInt(comment_id),
    );

    if (!commentToUpdate) {
        return "error: 존재하지 않는 댓글";
    } else if (commentToUpdate.user_id !== parseInt(user_id)) {
        return "error: 댓글 수정 권한 없음";
    }

    Object.keys(update_form).forEach((key) => {
        commentToUpdate[key] = update_form[key];
    });

    commentToUpdate.updated_at = getKoreanDateTime();
    savePosts();

    return commentToUpdate;
};

const deleteComment = ({ user_id, post_id, comment_id }) => {
    postsJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data", "posts.json"), "utf-8"),
    );

    const postToUpdate = postsJSON.find(
        (post) => post.post_id === parseInt(post_id),
    );
    const commentToDelete = postToUpdate.comments_list.find(
        (comment) => comment.comment_id === parseInt(comment_id),
    );

    if (!commentToDelete) {
        return "error: 존재하지 않는 댓글";
    } else if (commentToDelete.user_id !== parseInt(user_id)) {
        return "error: 댓글 삭제 권한 없음";
    }

    postToUpdate.comments_list = postToUpdate.comments_list.filter(
        (comment) => comment.comment_id !== parseInt(comment_id),
    );
    postToUpdate.comments -= 1;
    savePosts();

    return "success: 댓글 삭제 성공";
};

// ===== COMMON FUNCTIONS =====

function savePosts() {
    fs.writeFileSync(
        path.join(__dirname, "data", "posts.json"),
        JSON.stringify(postsJSON),
    );
}

// ===== EXPORT =====

export default {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    createComment,
    updateComment,
    deleteComment,
};