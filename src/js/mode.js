import { getParam } from './utils';

export const PREVIEW = 'preview';
export const EDITOR = 'editor';
export const READ_ONLY = 'readonly';
export const mode = getParam('mode') || EDITOR;

export const isPreviewMode = () => mode === PREVIEW;
export const isEditorMode = () => mode === EDITOR;
export const isReadOnlyMode = () => mode === READ_ONLY;