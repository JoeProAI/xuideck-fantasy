const projectId = process.env.FIREBASE_PROJECT_ID ?? "";

export default {
  providers: projectId
    ? [
        {
          domain: `https://securetoken.google.com/${projectId}`,
          applicationID: projectId,
        },
      ]
    : [],
};
