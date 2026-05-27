import { MEAL_LOG_CONTENT_PREVIEW_LENGTH } from '../constants/meal-log.constants';

export function buildContentPreview(content: string | null): string | null {
  if (!content) {
    return null;
  }

  if (content.length <= MEAL_LOG_CONTENT_PREVIEW_LENGTH) {
    return content;
  }

  return `${content.slice(0, MEAL_LOG_CONTENT_PREVIEW_LENGTH).trimEnd()}…`;
}
