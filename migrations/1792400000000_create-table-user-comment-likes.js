export const up = (pgm) => {
  pgm.createTable('user_comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"comments"',
      onDelete: 'cascade',
    },
  });

  pgm.addConstraint(
    'user_comment_likes',
    'unique_user_comment_like',
    'UNIQUE(user_id, comment_id)',
  );

  pgm.createIndex('user_comment_likes', 'comment_id');
};

export const down = (pgm) => {
  pgm.dropTable('user_comment_likes');
};
