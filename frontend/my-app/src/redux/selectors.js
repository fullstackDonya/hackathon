
// Sélecteur pour accéder à l'état de l'authentification
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

// Sélecteur pour obtenir les informations de l'utilisateur
export const selectUser = (state) => state.auth.user;

// Sélecteur pour obtenir les posts
export const selectPosts = (state) => state.posts.items;

// Sélecteur pour accéder aux commentaires d'un post
export const selectCommentsByPostId = (state, postId) => {
  return state.comments.filter((comment) => comment.postId === postId);
};
