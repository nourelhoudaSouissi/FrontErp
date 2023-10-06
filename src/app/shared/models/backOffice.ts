export class BackOffice {
    id?: number;
    lastName ?:string;
    firstName?:string;
     birthDate ?:string;
     emailOne ?:string;
     emailTwo ?:string;
     phoneNumberOne ?: number;
     phoneNumberTwo ?: number;
    address?:string;
     postCode ?: number;
     city ?: number;
    recommendationType ?: number;
    experience ?: number;
    experienceDetails ?:string;
    employeeFirstName ?:string;
    employeeLastName ?:string;
    employeeSerialNumber ?:string;
     civility?: Civility;
    title?: Title;
    employeeStatus?:EmployeeStatus;
    country?:Country;
    maritalSituation ?:MaritalSituation;
    provenance ?: Provenance;
    serialNumber?:string;
    socialSecurityNumber?:string;
    bankAccountNumber?:string;
    productivity?:number;
    photo?:string;
    workLocation?:WorkLocation;
    locationName?:string;
    resourceType?:ResourceType;
    departement?:Departement
}
export enum Departement{
    DEVELOPPEMENT ,
    QUALITE ,
    ARCHITECTURE ,
    DESIGN ,
    TESTS,
    RESSOURCES_HUMAINES ,
    MARKETING ,
    VENTE ,
    COMPTABILITE,
    FINANCES ,
    JURIDIQUE ,
    SUPPORT 
} 
export enum ResourceType{
    EXTERNAL_RESOURCE ,
     BACKOFFICE_RESOURCE,
     INTERNAL_RESOURCE}

export enum WorkLocation{
    MAIN ,
    OTHER_LOCATION 
}
export enum Civility{
    MRS,
    MS,
    MR
}

export enum Title{
    FRONT_END_DEVELOPER ,
    BACK_END_DEVELOPER ,
    FULLSTACK_DEVELOPER ,
    CRM ,
    HUMAN_RESOURCE_MANAGER ,
    HUMAN_RESOURCE,
    PROJECT_MANAGER ,
    TECH_LEAD ,
    UI_UX_DESIGNER ,
    QA_ENGINEER ,
    DEVOPS_ENGINEER ,
    WEB_DEVELOPER ,
    OFFICE_MANAGER,
    ACCOUNTANT ,
    SALES_REPRESENTATIVE ,
    CUSTOMER_SUPPORT_SPECIALIST ,
    MARKETING_COORDINATOR

}
export enum EmployeeStatus{
    IN_PROCESS ='En cours de traitement',
    IN_PROGRESS ='En cours',
    PRE_QUALIFIED ='Pré-qualifié',
    TOP_PROFILES ='Profils de haut niveau',
    CONVERTED_TO_RESOURCE ='Converti en Ressource',
    DO_NOT_CONTACT ='Ne pas contacter',
    ARCHIVE ='Archivé'
}
export enum Country{
    USA,
        AFGHANISTAN,
        ALBANIA,
        ALGERIA,
        ANDORRA,
        ANGOLA,
        ANTIGUA_DEPS,
        ARGENTINA,
        ARMENIA,
        AUSTRALIA,
        AUSTRIA,
        AZERBAIJAN,
        BAHAMAS,
        BAHRAIN,
        BANGLADESH,
        BARBADOS,
        BELARUS,
        BELGIUM,
        BELIZE,
        BENIN,
        BHUTAN,
        BOLIVIA,
        BOSNIA_HERZEGOVINA,
        BOTSWANA,
        BRAZIL,
        BRUNEI,
        BULGARIA,
        BURKINA,
        BURMA,
        BURUNDI,
        CAMBODIA,
        CAMEROON,
        CANADA,
        CAPE_VERDE,
        CENTRAL_AFRICAN_REP,
        CHAD,
        CHILE,
        CHINA,
        REPUBLIC_OF_CHINA,
        COLOMBIA,
        COMOROS,
        DEMOCRATIC_REPUBLIC_OF_THE_CONGO,
        REPUBLIC_OF_THE_CONGO,
        COSTA_RICA,
        CROATIA,
        CUBA,
        CYPRUS,
        CZECH_REPUBLIC,
        DANZIG,
        DENMARK,
        DJIBOUTI,
        DOMINICA,
        DOMINICAN_REPUBLIC,
        EAST_TIMOR,
        ECUADOR,
        EGYPT,
        EL_SALVADOR,
        EQUATORIAL_GUINEA,
        ERITREA,
        ESTONIA,
        ETHIOPIA,
        FIJI,
        FINLAND,
        FRANCE,
        GABON,
        GAZA_STRIP,
        THE_GAMBIA,
        GEORGIA,
        GERMANY,
        GHANA,
        GREECE,
        GRENADA,
        GUATEMALA,
        GUINEA,
        GUINEA_BISSAU,
        GUYANA,
        HAITI,
        HOLY_ROMAN_EMPIRE,
        HONDURAS,
        HUNGARY,
        ICELAND,
        INDIA,
        INDONESIA,
        IRAN,
        IRAQ,
        REPUBLIC_OF_IRELAND,
        PALESTIANE,
        ITALY,
        IVORY_COAST,
        JAMAICA,
        JAPAN,
        JONATHANLAND,
        JORDAN,
        KAZAKHSTAN,
        KENYA,
        KIRIBATI,
        NORTH_KOREA,
        SOUTH_KOREA,
        KOSOVO,
        KUWAIT,
        KYRGYZSTAN,
        LAOS,
        LATVIA,
        LEBANON,
        LESOTHO,
        LIBERIA,
        LIBYA,
        LIECHTENSTEIN,
        LITHUANIA,
        LUXEMBOURG,
        MACEDONIA,
        MADAGASCAR,
        MALAWI,
        MALAYSIA,
        MALDIVES,
        MALI,
        MALTA,
        MARSHALL_ISLANDS,
        MAURITANIA,
        MAURITIUS,
        MEXICO,
        MICRONESIA,
        MOLDOVA,
        MONACO,
        MONGOLIA,
        MONTENEGRO,
        MOROCCO,
        MOUNT_ATHOS,
        MOZAMBIQUE,
        NAMIBIA,
        NAURU,
        NEPAL,
        NEWFOUNDLAND,
        NETHERLANDS,
        NEW_ZEALAND,
        NICARAGUA,
        NIGER,
        NIGERIA,
        NORWAY,
        OMAN,
        OTTOMAN_EMPIRE,
        PAKISTAN,
        PALAU,
        PANAMA,
        PAPUA_NEW_GUINEA,
        PARAGUAY,
        PERU,
        PHILIPPINES,
        POLAND,
        PORTUGAL,
        PRUSSIA,
        QATAR,
        ROMANIA,
        ROME,
        RUSSIAN_FEDERATION,
        RWANDA,
        GRENADINES,
        SAMOA,
        SAN_MARINO,
        SAO_TOME_PRINCIPE,
        SAUDI_ARABIA,
        SENEGAL,
        SERBIA,
        SEYCHELLES,
        SIERRA_LEONE,
        SINGAPORE,
        SLOVAKIA,
        SLOVENIA,
        SOLOMON_ISLANDS,
        SOMALIA,
        SOUTH_AFRICA,
        SPAIN,
        SRI_LANKA,
        SUDAN,
        SURINAME,
        SWAZILAND,
        SWEDEN,
        SWITZERLAND,
        SYRIA,
        TAJIKISTAN,
        TANZANIA,
        THAILAND,
        TOGO,
        TONGA,
        TRINIDAD_TOBAGO,
        TUNISIA,
        TURKEY,
        TURKMENISTAN,
        TUVALU,
        UGANDA,
        UKRAINE,
        UNITED_ARAB_EMIRATES,
        UNITED_KINGDOM,
        URUGUAY,
        UZBEKISTAN,
        VANUATU,
        VATICAN_CITY,
        VENEZUELA,
        VIETNAM,
        YEMEN,
        ZAMBIA,
        ZIMBABWE

}
export enum MaritalSituation {
    SINGLE ,
    MARRIED ,
    DIVORCED ,
    WIDOWED ,
    COMPLICATED 
}

export enum Provenance {
    LINKEDIN ='LinkedIn',
    SPONTANEOUS_APPLICATION ='Candidature spontanée',
    JOBS_FORUM ='Forum emploi',
    RECOMMENDATION ='Recommandation',
    JOBBOARD ='Site des offres ',
    OTHER ='Autre'
}