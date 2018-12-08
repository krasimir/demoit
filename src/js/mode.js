import { getParam } from './utils';

export const PREVIEW = 'preview';
export const EDITOR = 'editor';
export const mode = getParam('mode') || EDITOR;
export const isPreviewMode = () => mode === PREVIEW;
export const isEditorMode = () => mode === EDITOR;