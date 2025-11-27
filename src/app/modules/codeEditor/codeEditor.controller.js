import { exec } from "child_process";

const openFolder = (req, res) => {
  const folderPath = req.body.path;

  exec(
    `docker exec inso_code_editor code-server --reuse-window "${folderPath}"`,
    (error, stdout, stderr) => {
      if (error) {
        return res.status(500).send('Error opening folder');
      }
      res.send('Folder opened in VS Code');
    },
  );
};

export const CodeEditorController = {
  openFolder,
};
