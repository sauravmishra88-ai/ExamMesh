# ExamMesh

Disaster-Resilient Examination Infrastructure — frontend prototype.

## Demo story

Failure → Continuity → Recovery → Verification

1. Open `index.html`.
2. Enter Examination.
3. Answer a few questions.
4. Open Admin Dashboard.
5. Click **Simulate Central Server Failure**.
6. Return to Candidate View and answer another question.
7. Observe **Continuity Mode Active** and pending local events.
8. Restore the server from Admin Dashboard.
9. Open Recovery Console.
10. Run Recovery and show the synchronization + hash-chain verification.
11. On the final question, click **Finish →** to submit the examination.

## Run locally

No backend is required for this prototype.

You can simply open `index.html` in a browser. For the cleanest local experience, use VS Code with Live Server.

## GitHub Pages

Upload the complete folder to a public GitHub repository and enable:

Settings → Pages → Deploy from branch → `main` → `/ (root)`.

The public URL will be:

`https://YOUR_USERNAME.github.io/ExamMesh/`

## Important prototype note

The failure simulation uses browser `localStorage`, so the Admin and Candidate views should be opened in the same browser/profile during the demo. This is intentional for the initial frontend prototype.

A later version can replace the local simulation with a Spring Boot backend, database, edge node and real synchronization APIs.
