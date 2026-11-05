# TasklyTools.org - Preservation Rules

This document is binding for every phase of the rebuild. If any instruction conflicts with
these rules, these rules win.

---

## 1. Immutable existing project

The following are immutable unless the project owner gives explicit written approval for a
specific file and change:

- Every file and directory currently in the repository.
- `index-old.html` (reference source).
- `navbar.html`, `footer.html`, `nav.js`, `footer-script.js`, `pre-load.html`, `sidebar.html`.
- All CSS, JavaScript, HTML, images, fonts, and configurations under `wp-content/`,
  `wp-includes/`, `wp-json/`, `cdn-cgi/`, `assets/`, and all content directories.
- `CNAME`.
- `_config.yml`.
- `.htaccess`.
- `robots.txt`.
- `sitemap.xml`.
- `404.html`.
- GitHub Pages settings and deployment configuration.
- The custom domain configuration.

No delete, rename, move, overwrite, truncate, chmod, or content change is allowed.

---

## 2. Allowed operations

Allowed:

- Read any file.
- Search and analyze the repository.
- Run read-only commands (`ls`, `git status`, `git diff`, `git log`, `grep`, `wc`, `du`).
- Create new documentation files whose names do not exist.
- Create new directories and new files in later phases, provided every path is new.

Not allowed in Phase 0:

- Building the new website.
- Creating or overwriting `index.html`.
- Editing any existing file.
- Installing dependencies.
- Running builds that write into the repository.
- Deploying.
- Committing or pushing.
- Staging or unstaging files.
- Reverting or cleaning the working tree.

---

## 3. Pre-existing dirty working tree

At the start of Phase 0 the working tree already contained:

- 103 modified tracked files.
- 1 deleted tracked file: `index.html`.
- 15 untracked files and directories.

These changes were present before the audit and are not attributable to it. Required
handling:

1. Do not run `git add`, `git commit`, `git restore`, `git checkout -- .`, `git reset`,
   `git clean`, or `git stash` on these files.
2. Do not "fix" the deleted `index.html`.
3. Treat the current working tree as the owner's baseline.
4. Before Phase 1, the owner should back up the working tree or commit it on a separate
   branch, outside this task's scope.
5. Record `git status --porcelain` before and after each phase to prove no unexpected
   changes.

Suggested read-only verification:

```bash
git status --porcelain
git diff --stat
git ls-files --others --exclude-standard
```

---

## 4. Root `index.html` rule

The root `index.html` currently exists in `HEAD` but is deleted in the working tree.

Rules:

- Do not create `/index.html`.
- Do not restore `/index.html`.
- Do not overwrite `/index.html`.
- Do not point new pages at `/index.html`.
- Do not modify deployment settings to substitute it.

Implication: the new homepage cannot be published at the domain root until the owner makes an
explicit migration decision. Until then, the new platform must live under a new path with a
non-colliding entry filename (for example `next/home.html` or `next/index.html` only if the
owner explicitly approves a new `index.html` inside a brand-new directory).

This is recorded as Blocker B1 in `DEVELOPMENT_ROADMAP.md`.

---

## 5. New-file naming policy

Before creating any file:

1. Check that the path does not exist.
2. If it exists, choose a different filename or directory.
3. Never reuse an existing filename in a different directory to shadow or replace it.
4. Prefer a dedicated new namespace so future collision checks stay simple.

Reserved existing paths that new work must avoid:

- `/index.html` (even though absent from the working tree)
- `/navbar.html`, `/footer.html`, `/nav.js`, `/footer-script.js`, `/pre-load.html`
- `/sidebar.html`, `/search.html`, `/404.html`
- `/assets/`, `/wp-content/`, `/wp-includes/`, `/wp-json/`, `/cdn-cgi/`
- `/tools/`, `/utility-tools/`
- `/about-us/`, `/contact-us/`, `/privacy-policy/`, `/terms-and-conditions/`, `/disclaimer/`
- `/base64-encoder-decoder/`, `/htaccess-redirect-generator/`,
  `/password-strength-checker/`, `/robots-txt-generator-validator/`
- Every directory listed in `PROJECT_AUDIT.md`

Proposed new names such as `invoice-generator`, `profit-calculator`,
`freelance-rate-calculator`, `proposal-generator`, and `utm-builder` do not currently exist
and are available.

---

## 6. Reuse without editing

The existing navigation and footer must be reused, not forked.

Reuse mechanism:

- Include an empty `<div id="navbar-container"></div>` inside
  `<header id="main-header" class="container-fluid sticky-top">`.
- Include an empty `<div id="footer-container"></div>` inside
  `<footer class="container-fluid footer-section pt-5 pb-3">`.
- Include `<div id="pre-load-animation"></div>`.
- Include the back-to-top button with `id="myBtn"`.
- Load existing `/footer-script.js` and `/nav.js` unchanged.
- Load existing Bootstrap bundle for dropdown/collapse behavior.
- Load existing theme CSS for nav/footer styling, or create new scoped CSS that does not
  modify the originals.

Do not copy `navbar.html` or `footer.html` into new files and edit the copies. That creates
divergence and violates the "same behavior" requirement.

If new navigation items are required, raise a change request. Options:

1. Owner approves editing `navbar.html` (currently prohibited).
2. Add an additive, new partial and a new loader for the new namespace, while old pages keep
   the old partial.
3. Use CSS/JS enhancement layered on the injected DOM without changing the source file.

Option 2 is the safest for Phase 1 and beyond.

---

## 7. CSS and JavaScript isolation

New work must not:

- Edit global theme CSS.
- Add rules that target old pages.
- Change CSS custom properties globally on old pages.
- Replace Bootstrap or icon libraries.
- Remove or reorder existing scripts on old pages.

New work should:

- Use a new stylesheet and script under a new namespace.
- Scope selectors to a new body class or wrapper, for example `.tt-next`.
- Keep `!important` usage to a minimum.
- Avoid relying on inline overrides that leak to legacy pages.

---

## 8. Deployment preservation

Do not:

- Modify `CNAME`.
- Modify `_config.yml`.
- Add or change GitHub Actions workflows.
- Add a `.nojekyll` file without approval.
- Change the publishing branch, source, or custom domain.
- Deploy from a preview or run `gh-pages` commands.
- Create redirects that affect existing URLs.

Later phases may propose deployment changes, but they require explicit owner approval and a
rollback plan.

---

## 9. Dependency policy

- No unnecessary dependencies.
- No paid APIs required for core tools.
- Prefer browser-native APIs.
- Any third-party script must be justified, privacy-reviewed, and loaded only on pages that
  need it.
- Do not install packages into the repository during Phase 1 unless the owner approves and a
  lockfile policy is defined.
- GitHub Pages must remain able to serve the site without a build step, or the build must run
  entirely in CI with no repository writes beyond generated output.

---

## 10. Phase gate checklist

Complete before starting any build phase:

- [ ] Owner confirms the current dirty working tree is the intended baseline.
- [ ] Owner backs up or commits the baseline outside this task.
- [ ] Root `index.html` launch strategy is decided (Blocker B1).
- [ ] New namespace/path is approved.
- [ ] Navigation change strategy is approved (reuse only vs. additive partial).
- [ ] Target page list and URL scheme are approved.
- [ ] Checkout, email, analytics, and consent providers are chosen.
- [ ] `git status` baseline is recorded.

Complete before any commit or deploy:

- [ ] `git status` shows only intended new files.
- [ ] No existing file appears as modified or deleted.
- [ ] `CNAME`, `_config.yml`, `robots.txt`, `sitemap.xml`, and `404.html` are unchanged.
- [ ] New pages load and reuse the navbar/footer correctly.
- [ ] New pages have canonical, OG, Twitter, and JSON-LD metadata.
- [ ] Accessibility and responsive checks pass.
- [ ] Owner explicitly approves the commit or deploy.

---

## 11. Incident response

If an existing file is accidentally modified:

1. Stop.
2. Do not attempt to hide the change.
3. Report the exact file and diff.
4. Restore only with owner approval and only from a known-good copy or `HEAD`, using a
   targeted command such as `git restore --source=HEAD -- <file>`.
5. Never run a repository-wide restore or clean.
6. Record the incident in the phase report.

If a new file collides with an existing path:

1. Stop.
2. Do not overwrite.
3. Rename the new file.
4. Update all references.
5. Verify no existing file changed.

---

## 12. Change request template

Any request to touch an existing file must include:

- File path.
- Exact intended change.
- Reason the change cannot be done additively.
- Risk to existing pages.
- Rollback plan.
- Owner approval reference.

No approval, no change.
