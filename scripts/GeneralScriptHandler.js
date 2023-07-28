document.getElementById('settings').onclick = () => {
    document.getElementById('ui-settings-backdrop').style.display = 'flex'
}
const { promises: NodeFS } = require('fs');
const { join: PathJoin } = require('path');

document.getElementById('ui-delete-captures-folder').onclick = async () => {
  const confirmationAlert = window.confirm(`Are you sure to delete the entire Streamsoft captures folder? Video editors might not work because of lost media that were caused by you.`);

  if (confirmationAlert) {
    if (window.confirm('Are you actually sure?')) {
      if (window.confirm('Really, really sure?')) {
        if (window.confirm('Bro, are you actually sure?')) {
          if (window.confirm('Your memories are going to be deleted if you do this. \nYou REALLY, REALLY, sure?')) {
            if (window.confirm("Don't blame me if you cry. It's your fault. You sure?")) {
              if (window.confirm('Ah, you know what? Fuck it. Really sure on deleting your clips?')) {
                try {
                  const directoryPath = PathJoin(ElectronApp.getPath('videos'), 'Streamsoft Captures');

                  const files = await NodeFS.readdir(directoryPath);

                  for (const file of files) {
                    const filePath = PathJoin(directoryPath, file);
                    const stats = await NodeFS.stat(filePath);

                    if (stats.isDirectory()) {
                      // Recursive call to delete subdirectories
                      const subFiles = await NodeFS.readdir(filePath);

                      for (const subFile of subFiles) {
                        const subFilePath = PathJoin(filePath, subFile);
                        const subStats = await NodeFS.stat(subFilePath);

                        if (subStats.isDirectory()) {
                          // Recursive call to delete sub-subdirectories
                          const subSubFiles = await NodeFS.readdir(subFilePath);

                          for (const subSubFile of subSubFiles) {
                            const subSubFilePath = PathJoin(subFilePath, subSubFile);
                            await NodeFS.unlink(subSubFilePath);
                          }

                          await NodeFS.rmdir(subFilePath);
                        } else {
                          await NodeFS.unlink(subFilePath);
                        }
                      }

                      await NodeFS.rmdir(filePath);
                    } else {
                      await NodeFS.unlink(filePath);
                    }
                  }

                  console.log('Directory contents deleted successfully.');
                } catch (err) {
                  console.error('Error while deleting directory contents:', err);
                }
              }
            }
          }
        }
      }
    }
  }
};
