'use strict';

module.exports = {
  // Development assets
  github: {
    clientID: process.env.GITHUB_ID || 'b2725ad65f3769561b52',
    clientSecret: process.env.GITHUB_SECRET || '5c6b8ad8f0123a11363ead308eb8456e74ad449f',
    callbackURL: '/api/auth/github/callback'
  }
};
