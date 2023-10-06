export interface Language{
    Id ?:number;
    languageLevel?:LanguageLevel;
    additionalInformation?:string;
    language ?:Languages;
}

export enum Languages{
    Arabe="Arabe",  
    Azerbaïdjanais="Azerbaïdjanais", 
    Bengali="Bengali", 
    Cantonais="Cantonais", 
    Chinois_mandarin="Chinois mandarin", 
    Anglais="Anglais", 
    Français="Français", 
    Allemand="Allemand",
     Gujarati="Gujarati", 
    Hindi="Hindi", 
    Indonésien="Indonésien", 
    Italien="Italien", 
    Japonais="Japonais",
     Javanais="Javanais",
      Kannada="Kannada",
       Coréen="Coréen", 
       Malais="Malais",
        Marathi="Marathi", 
        Persan="Persan", 
        Polonais="Polonais",
         Portugais="Portugais",
          Pendjabi="Pendjabi", 
          Russe="Russe",
          Espagnol="Espagnol", 
          Tamoul="Tamoul", 
          Télougou="Télougou",
           Turc="Turc",
            Ourdou="Ourdou",
             Vietnamien="Vietnamien"
      }


      export enum LanguageLevel{
        BEGINNER_A1="BEGINNER_A1",
        BEGINNER="BEGINNER",
        ELEMENTARY_A2="ELEMENTARY_A2",
        BASIC="BASIC",
        INTERMEDIATE_B1="INTERMEDIATE_B1",
        INTERMEDIATE="INTERMEDIATE",
        UPPER_INTERMEDIATE_B2="UPPER_INTERMEDIATE_B2",
        PROFESSIONAL="PROFESSIONAL",
        ADVANCED_C1="ADVANCED_C1",
        FLUENT="FLUENT",
        PROFICIENT_C2="PROFICIENT_C2",
        NATIVE_LANGUAGE="NATIVE_LANGUAGE",
        BILINGUAL="BILINGUAL"
    }