import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import { Articles } from '../both';
import './publications';

Meteor.users.deny({
 update() { return true; }
});

/**
 * Insère les données du fichier 'sample-articles.json' dans la collection articles
 */
insertSampleData = function() {
    // Chargement du fichier
    let json = JSON.parse(Assets.getText('sample-articles.json'));
  
    // Récupération des utilisateurs 
    let arrayUserIds = Meteor.users.find().fetch().map(user => user._id);
  
    if(arrayUserIds.length == 0) {
      console.log('Erreur: Nécessite au moins un utilisateur dans la collection Meteor.users');
    }
  
    // On parcourt tous les articles du fichier chargé
    let hour = 1;
    json.reverse().forEach(article => {
      // On défini un ownerId en prenant un id utilisateur au hazard
      article.ownerId = arrayUserIds[Math.floor(Math.random()*arrayUserIds.length)];
      // On sépare tous les articles d'une heure
      article.createdAt = moment().subtract(hour--, 'hour').toDate();
      // On insère l'article
      Articles.insert(article);
    });
    console.log('Remplissage de la base terminée');
}