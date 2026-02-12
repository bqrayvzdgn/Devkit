import { open, save } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';
import { useToastContext } from '../contexts/ToastContext';

interface FileFilter {
  name: string;
  extensions: string[];
}

export function useFileOperations() {
  const { showToast } = useToastContext();

  const uploadFile = async (filters?: FileFilter[]): Promise<string | null> => {
    try {
      const filePath = await open({
        multiple: false,
        filters: filters || [{ name: 'All Files', extensions: ['*'] }],
      });

      if (!filePath) return null;

      const contents = await invoke<string>('read_text_file', { path: filePath });
      showToast('File loaded successfully!');
      return contents;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load file';
      showToast(message, 'error');
      return null;
    }
  };

  const downloadFile = async (
    contents: string,
    defaultName?: string,
    filters?: FileFilter[]
  ): Promise<boolean> => {
    try {
      const filePath = await save({
        defaultPath: defaultName,
        filters: filters || [{ name: 'All Files', extensions: ['*'] }],
      });

      if (!filePath) return false;

      await invoke('write_text_file', { path: filePath, contents });
      showToast('File saved successfully!');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save file';
      showToast(message, 'error');
      return false;
    }
  };

  return { uploadFile, downloadFile };
}
