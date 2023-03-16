export enum LicenseError {
    E1_INVALID_WIKIDATA_ID = <any>{ error: 1, message: "Invalid Wikidata entity id"},
    E2_NO_WIKIDATA_ENTITY = <any>{ error: 2, message: "No Wikidata entity found for entity id"},
    E3_NO_WIKIPEDIA_ARTICLE_FOR_TITLE = <any>{ error: 3, message: "No existing Wikipedia article for wikipedia title"},
    E4_REQUEST_WIKI_CAUSES_UNKNOWN_ERROR = <any>{ error: 4, message: "Requesting Wikidata/Wikipedia entity causes an unknown error"},
    E5_NO_IMAGE_FOUND = <any>{ error: 5, message: "No image property (P18) found for Wikidata entity"},
    E6_NO_WIKIPEDIA_FOUND_FOR_SEARCH = <any>{ error: 6, message: "No Wikipedia article found for search with Wikipedia title"},
    E7_PROCESSING_WIKI_CAUSES_UNKNOWN_ERROR = <any>{ error: 7, message: "Processing Wikidata/Wikipedia entity causes an unknown error"},
    E8_WRITING_CYPRESS_REQUEST_FiLE_ERROR = <any>{ error: 8, message: "Writing Cypress request file causes an error"},
    E9_CYPRESS_TIMEOUT_ERROR = <any>{ error: 9, message: "Cypress timeout error"},
    E10_READING_CYPRESS_RESPONSE_FiLE_ERROR = <any>{ error: 10, message: "Reading Cypress reponse file causes an error"},
}
