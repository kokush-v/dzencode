import PostService from '../services/post.service';

export const getNestedReplies = async (postId: string) => {
  const replies = await new PostService().findReplies(postId);

  await Promise.all(
    replies.map(async (reply) => {
      const nestedReplies = await getNestedReplies(reply.id);
      reply.replies = nestedReplies;
      return reply;
    })
  );

  return replies;
};
