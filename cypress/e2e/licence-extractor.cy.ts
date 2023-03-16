describe('License', () => {

  it('load', () => {
    cy.readFile('work/exchange-image-2-data.json').then((obj) => {
      const imageUrl = obj.originurl;
      cy.log("Image to load: " + imageUrl);

      cy.visit('https://lizenzhinweisgenerator.de/')
      cy.get('form input#file-form-input').type(imageUrl);
      cy.contains('button', 'Los!').click()

      // für "gemeinfrei"
      // cy.contains('div', 'Trotzdem Rechtehinweis erstellen').click()

      cy.contains('label', 'Online').click()
      cy.contains('label', 'Einzeln').click()
      cy.contains('label', 'Nein, ich möchte das Bild in seiner ursprünglichen Erscheinungsform nutzen.').click()
      cy.contains('button', 'HTML').click()

      cy.get('div#escaped-attribution').then(($div) => {
        const attributionText = $div.text().trim();
        cy.writeFile('work/exchange-image-3-license.html', attributionText)
        obj.license = attributionText;
        cy.writeFile('work/exchange-image-3-license.json', obj)
      });
    })
  });

});

//const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Raths-Apotheke_-_Bremen%2C_Am_Markt_11.jpg/300px-Raths-Apotheke_-_Bremen%2C_Am_Markt_11.jpg';
//const imageUrl = 'https://commons.wikimedia.org/wiki/File:Bremen,_\'Roland_am_Marktplatz\'_(ca._1905;_Verlag_Alb._Rosenthal,_Bremen).jpg?uselang=de';
//const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Aachen_Germany_Imperial-Cathedral-01.jpg/500px-Aachen_Germany_Imperial-Cathedral-01.jpg';
//const imageUrl = 'https://de.wikipedia.org/wiki/Datei:Buxton_Memorial_Drinking_Fountain_-_geograph.org.uk_-_343490.jpg';
// const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Harpstedt_Christuskirche.jpg/300px-Harpstedt_Christuskirche.jpg'
// const imageUrl = 'https://commons.wikimedia.org/wiki/File:Harpstedt_Christuskirche.jpg'
//const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Sonnenstein_von_Harpstedt.JPG/300px-Sonnenstein_von_Harpstedt.JPG'

//
/* geht nicht
const imageUrl = 'https://upload.wikimedia.org/wikipedia/de/thumb/9/9f/2_Euro_Gedenkm%C3%BCnze_2010_Deutschland.jpg/299px-2_Euro_Gedenkm%C3%BCnze_2010_Deutschland.jpg'

*/

// gemeinfrei
// const imageUrl = 'https://commons.wikimedia.org/wiki/File:Stamps_of_Germany_(BRD)_1988,_MiNr_1381.jpg'
// const imageUrl = 'https://commons.wikimedia.org/wiki/File:The_Promenade_and_Tower_from_North_Pier,_Blackpool,_England-LCCN2002696386.jpg'
// const imageUrl = 'https://commons.wikimedia.org/wiki/File:Lebensbaum am Herbartgang 1.jpg';


// Fehler:
// https://commons.wikimedia.org/wiki/File:Draufgänger im Oldenburger Staugraben - DSCF1115.JPG
