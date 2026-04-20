export const schemaSql = `CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  clerk_user_id VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NULL,
  created_at DATETIME(3) NOT NULL,
  INDEX idx_users_clerk_user_id (clerk_user_id)
);

CREATE TABLE IF NOT EXISTS journal_entries (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  title VARCHAR(20) NOT NULL,
  content MEDIUMTEXT NOT NULL,
  created_at DATETIME(3) NOT NULL,
  INDEX idx_journal_entries_user_id_created_at (user_id, created_at),
  CONSTRAINT fk_journal_entries_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS translations (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  entry_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  language VARCHAR(10) NOT NULL,
  content MEDIUMTEXT NOT NULL,
  UNIQUE KEY uq_translations_entry_user_language (entry_id, user_id, language),
  INDEX idx_translations_user_id_entry_id (user_id, entry_id),
  CONSTRAINT fk_translations_entry FOREIGN KEY (entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE,
  CONSTRAINT fk_translations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audio (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  translation_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  audio_url VARCHAR(255) NOT NULL,
  created_at DATETIME(3) NOT NULL,
  UNIQUE KEY uq_audio_translation_user (translation_id, user_id),
  INDEX idx_audio_user_id_translation_id (user_id, translation_id),
  CONSTRAINT fk_audio_translation FOREIGN KEY (translation_id) REFERENCES translations(id) ON DELETE CASCADE,
  CONSTRAINT fk_audio_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS saved_words (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  word VARCHAR(255) NOT NULL,
  translation TEXT NOT NULL,
  context_sentence TEXT NOT NULL,
  created_at DATETIME(3) NOT NULL,
  INDEX idx_saved_words_user_id_created_at (user_id, created_at),
  CONSTRAINT fk_saved_words_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;
