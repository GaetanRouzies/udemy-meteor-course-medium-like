import './comment.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Comments } from '../../../both';

Template.comment_form.events({
    'submit .js-create-comment'(event, instance){
        event.preventDefault();

        if(!Meteor.userId()){
            Modal.show('login_modal');
            return;
        }

        const content = event.target.content.value;

        Meteor.call('insertComment', { content: content, articleId: FlowRouter.getParam('articleId')}, function(err, res) {
            if(!err) {
                event.target.content.value = '';
            }
        });
    }
});

Template.comment_list.helpers({
    comments() {
        return Comments.find({articleId: FlowRouter.getParam('articleId')}, { sort: {createdAt: 1}});
    }
})