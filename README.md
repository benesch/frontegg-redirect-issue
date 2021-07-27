# frontegg-redirect-issue

Repro instructions:

1. Run `npm start`.
2. Navigate to http://localhost:3000/some-nonexistent-page. The browser will enter a
   redirect loop.
3. Navigate to http://localhost:3000/account/login and log in. (May need to
   sign up for an account first.)
4. Attempt to log out. The redirect to /secrets-home will take precedence and
   the logout will not occur.

To work around, swap the `<Redirect>` component for the
`<RedirectIfNotAuthRoute>` component, and it all works out. Looks like there is
some asynchronicity in how Frontegg handles routing that causes the redirect
loop.
