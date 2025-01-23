/*
 * Common Messages
 *
 * This contains all the common text
 */
import { defineMessages } from 'react-intl';

export const scope = 'app.common';

export default defineMessages({
  appTitle: {
    id: `${scope}.appTitle`,
    defaultMessage: 'Global Ecosystem Typology',
  },
  metaDescription: {
    id: `${scope}.metaDescription`,
    defaultMessage: 'Global Ecosystem Typology',
  },
  realmSelect: {
    id: `${scope}.realmSelect`,
    defaultMessage: 'Select a Realm',
  },
  biomeSelect: {
    id: `${scope}.biomeSelect`,
    defaultMessage: 'Select a Biome',
  },
  groupSelect: {
    id: `${scope}.groupSelect`,
    defaultMessage: 'Select a Functional Group',
  },
  realm: {
    id: `${scope}.realm`,
    defaultMessage: 'Realm',
  },
  realms: {
    id: `${scope}.realms`,
    defaultMessage: 'Realms',
  },
  biome: {
    id: `${scope}.biome`,
    defaultMessage: 'Biome',
  },
  biomes: {
    id: `${scope}.biomes`,
    defaultMessage: 'Biomes',
  },
  close: {
    id: `${scope}.close`,
    defaultMessage: 'Close',
  },
  group: {
    id: `${scope}.group`,
    defaultMessage: 'Functional group',
  },
  groupShort: {
    id: `${scope}.groupShort`,
    defaultMessage: 'Group',
  },
  groupLong: {
    id: `${scope}.groupLong`,
    defaultMessage: 'Ecosystem functional group',
  },
  groups: {
    id: `${scope}.groups`,
    defaultMessage: 'Functional groups',
  },
  groupsShort: {
    id: `${scope}.groupsShort`,
    defaultMessage: 'Groups',
  },
  groupsLong: {
    id: `${scope}.groupsLong`,
    defaultMessage: 'Ecosystem functional groups',
  },
  realmsCore: {
    id: `${scope}.realmsCore`,
    defaultMessage: 'Core realms',
  },
  realmsTrans: {
    id: `${scope}.realmsTrans`,
    defaultMessage: 'Transitional realms',
  },
  navExplore: {
    id: `${scope}.navExplore`,
    defaultMessage: 'Explore',
  },
  navAnalyse: {
    id: `${scope}.navAnalyse`,
    defaultMessage: 'By Area',
  },
  navGroup_about: {
    id: `${scope}.navGroup_about`,
    defaultMessage: 'About',
  },
  navGroup_main: {
    id: `${scope}.navGroup_main`,
    defaultMessage: 'Main Content',
  },
  navGroup_other: {
    id: `${scope}.navGroup_other`,
    defaultMessage: 'Other',
  },
  page_typology: {
    id: `${scope}.page_typology`,
    defaultMessage: 'Typology',
  },
  page_about: {
    id: `${scope}.page_about`,
    defaultMessage: 'About',
  },
  page_methods: {
    id: `${scope}.page_methods`,
    defaultMessage: 'Methods',
  },
  page_glossary: {
    id: `${scope}.page_glossary`,
    defaultMessage: 'Glossary',
  },
  page_feedback: {
    id: `${scope}.page_feedback`,
    defaultMessage: 'Feedback',
  },
  page_privacy: {
    id: `${scope}.page_privacy`,
    defaultMessage: 'Privacy policy',
  },
  page_terms: {
    id: `${scope}.page_terms`,
    defaultMessage: 'Terms of use',
  },
  page_resources: {
    id: `${scope}.page_resources`,
    defaultMessage: 'Resources',
  },
  page_faqs: {
    id: `${scope}.page_faqs`,
    defaultMessage: 'FAQs',
  },
  imageCreditBy: {
    id: `${scope}.imageCreditBy`,
    defaultMessage: 'Image by: ',
  },
  imageCredit_home: {
    id: `${scope}.imageCredit_home`,
    defaultMessage: 'Shifaaz Shamoon on Unsplash',
  },
  imageCredit_typology: {
    id: `${scope}.imageCredit_typology`,
    defaultMessage: 'Shifaaz Shamoon on Unsplash',
  },
  imageCredit_about: {
    id: `${scope}.imageCredit_about`,
    defaultMessage: 'Shifaaz Shamoon on Unsplash',
  },
  imageCredit_methods: {
    id: `${scope}.imageCredit_methods`,
    defaultMessage: 'Shifaaz Shamoon on Unsplash',
  },
  imageCredit_glossary: {
    id: `${scope}.imageCredit_glossary`,
    defaultMessage: 'Shifaaz Shamoon on Unsplash',
  },
  imageCredit_terms: {
    id: `${scope}.imageCredit_terms`,
    defaultMessage: 'Shifaaz Shamoon on Unsplash',
  },
  imageCredit_privacy: {
    id: `${scope}.imageCredit_privacy`,
    defaultMessage: 'Shifaaz Shamoon on Unsplash',
  },
  imageCredit_feedback: {
    id: `${scope}.imageCredit_feedback`,
    defaultMessage: 'Shifaaz Shamoon on Unsplash',
  },
  occurrence: {
    id: `${scope}.occurrence`,
    defaultMessage: 'Occurrence',
  },
  occurrence_major: {
    id: `${scope}.occurrence_major`,
    defaultMessage: 'Major',
  },
  occurrence_minor: {
    id: `${scope}.occurrence_minor`,
    defaultMessage: 'Minor',
  },
  partner_0: {
    id: `${scope}.partner_0`,
    defaultMessage: 'IUCN Red List of Ecosystems',
  },
  partner_1: {
    id: `${scope}.partner_1`,
    defaultMessage: 'International Union for Conservation of Nature',
  },
  partner_2: {
    id: `${scope}.partner_2`,
    defaultMessage: 'Commission on Ecosystem Management',
  },
  partner_3: {
    id: `${scope}.partner_3`,
    defaultMessage: 'Centre for Ecosystem Science',
  },
  partner_4: {
    id: `${scope}.partner_4`,
    defaultMessage: 'University of New South Wales',
  },
  partner_0_url: {
    id: `${scope}.partner_0_url`,
    defaultMessage: 'https://iucnrle.org/',
  },
  partner_1_url: {
    id: `${scope}.partner_1_url`,
    defaultMessage: 'https://www.iucn.org/',
  },
  partner_2_url: {
    id: `${scope}.partner_2_url`,
    defaultMessage:
      'https://www.iucn.org/commissions/commission-ecosystem-management',
  },
  partner_3_url: {
    id: `${scope}.partner_3_url`,
    defaultMessage: 'https://www.ecosystem.unsw.edu.au/',
  },
  partner_4_url: {
    id: `${scope}.partner_4_url`,
    defaultMessage: 'https://www.unsw.edu.au/',
  },
  requireConsent: {
    id: `${scope}.requireConsent`,
    defaultMessage: 'Please {showConsentLink} to view the feedback form.',
  },
  showConsentLink: {
    id: `${scope}.showConsentLink`,
    defaultMessage: 'allow third-party services and cookies',
  },
  relatedHintTrans: {
    id: `${scope}.relatedHintTrans`,
    defaultMessage: 'See the {count} transitional realms for related biomes',
  },
  relatedHintCore: {
    id: `${scope}.relatedHintCore`,
    defaultMessage: 'See the {count} core realms for related biomes',
  },
});
