import { Articles, Comments, articleUpsertSchema, commentInsertSchema } from './collections';
import { check } from 'meteor/check';

Meteor.methods({
    insertArticle(article) {
        articleUpsertSchema.validate(article);

        if (!this.userId) {
            throw new Meteor.Error('not-connected');
        }

        let articleDoc = {
            title: article.title,
            content: article.content,
            createdAt: new Date(),
            ownerId: this.userId
        };

        return Articles.insert(articleDoc);
    },
    updateArticle(article) {
        articleUpsertSchema.validate(article);
        
        if (!this.userId) {
            throw new Meteor.Error('not-connected');
        }

        let articleFound = Articles.findOne({_id: article.id});
        if (articleFound.ownerId !== this.userId) {
            throw new Meteor.Error('unauthorized', 'L\'utilisateur doit être l\'auteur de l\'article');
        }

        Articles.update({_id: article.id}, 
        { 
            $set: 
            {
                title: article.title, 
                content: article.content
            }
        });
    },
    removeArticle(articleId) {
        check(articleId, String);

        if (!this.userId) {
            throw new Meteor.Error('not-connected');
        }

        let articleFound = Articles.findOne({_id: articleId});
        if (articleFound.ownerId !== this.userId) {
            throw new Meteor.Error('unauthorized', 'L\'utilisateur doit être l\'auteur de l\'article');
        }

        Articles.remove({_id: articleId});
    },
    insertComment(comment) {
        commentInsertSchema.validate(comment);

        if (!this.userId) {
            throw new Meteor.Error('not-connected');
        }
        
        let commentDoc = {
            content: comment.content,
            articleId: comment.articleId,
            createdAt: new Date(),
            ownerId: this.userId
        }

        Comments.insert(commentDoc);
    }
});