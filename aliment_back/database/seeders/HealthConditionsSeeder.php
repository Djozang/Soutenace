<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class HealthConditionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $conditions = [
            // 1. Hypertension artérielle
            [
                'name' => 'Hypertension artérielle',
                'slug' => Str::slug('Hypertension artérielle'),
                'description' => 'Maladie caractérisée par une pression artérielle trop élevée',
                'recommended_foods' => json_encode([
                    'Bananes', 'Épinards', 'Avoine', 'Yaourt grec nature', 
                    'Patates douces', 'Graines de lin', 'Betteraves', 'Poissons gras',
                    'Légumineuses', 'Fruits rouges'
                ]),
                'avoid_foods' => json_encode([
                    'Sel de table', 'Charcuterie', 'Fromages salés', 'Plats préparés',
                    'Sauces industrielles', 'Biscuits apéritifs', 'Aliments en conserve',
                    'Bouillons cubes', 'Fast-food', 'Alcool'
                ]),
                'additional_advice' => 'Limiter la consommation de sodium à 1500mg/jour. Privilégier les aliments riches en potassium, magnésium et calcium.'
            ],

            // 2. Diabète de type 2
            [
                'name' => 'Diabète de type 2',
                'slug' => Str::slug('Diabète de type 2'),
                'description' => 'Trouble métabolique caractérisé par une hyperglycémie chronique',
                'recommended_foods' => json_encode([
                    'Légumes non-féculents', 'Poissons gras (saumon, maquereau)', 
                    'Œufs', 'Noix et graines', 'Huile d\'olive', 'Avocat',
                    'Céréales complètes', 'Légumineuses', 'Yaourt grec nature',
                    'Baies (myrtilles, fraises)'
                ]),
                'avoid_foods' => json_encode([
                    'Sucres raffinés', 'Boissons sucrées', 'Jus de fruits industriels',
                    'Pains blancs', 'Pâtisseries', 'Riz blanc', 'Pâtes blanches',
                    'Fruits en conserve au sirop', 'Aliments frits', 'Alcool'
                ]),
                'additional_advice' => 'Contrôler l\'index glycémique des aliments. Manger à heures régulières et fractionner les repas.'
            ],

            // 3. Favisme (Déficit en G6PD)
            [
                'name' => 'Favisme',
                'slug' => Str::slug('Favisme'),
                'description' => 'Déficit en glucose-6-phosphate déshydrogénase',
                'recommended_foods' => json_encode([
                    'Riz', 'Pommes de terre', 'Viandes maigres', 'Poissons',
                    'Œufs', 'Lait et produits laitiers', 'Légumes verts',
                    'Fruits (sauf ceux à éviter)', 'Céréales complètes'
                ]),
                'avoid_foods' => json_encode([
                    'Fèves', 'Pois', 'Lentilles', 'Soja', 'Blueberries',
                    'Jus de canneberge', 'Aliments contenant de la quinine',
                    'Colorants alimentaires artificiels', 'Alcool'
                ]),
                'additional_advice' => 'Éviter strictement les fèves et certains médicaments (comme les antipaludéens). Consulter la liste complète des substances à éviter.'
            ],

            // 4. Maladies gastriques (Gastrite, Ulcère)
            [
                'name' => 'Maladies gastriques',
                'slug' => Str::slug('Maladies gastriques'),
                'description' => 'Affections touchant l\'estomac (gastrite, ulcère gastro-duodénal)',
                'recommended_foods' => json_encode([
                    'Bananes', 'Pommes', 'Flocons d\'avoine', 'Riz blanc',
                    'Pain blanc', 'Légumes cuits', 'Viandes maigres',
                    'Poissons', 'Œufs', 'Yaourt nature'
                ]),
                'avoid_foods' => json_encode([
                    'Aliments épicés', 'Café', 'Thé', 'Chocolat', 'Alcool',
                    'Agrumes', 'Tomates', 'Aliments gras', 'Aliments frits',
                    'Boissons gazeuses'
                ]),
                'additional_advice' => 'Manger lentement, fractionner les repas (5-6 petits repas par jour). Éviter de se coucher juste après avoir mangé.'
            ],

            // 5. Obésité
            [
                'name' => 'Obésité',
                'slug' => Str::slug('Obésité'),
                'description' => 'Excès de masse grasse corporelle',
                'recommended_foods' => json_encode([
                    'Légumes non-féculents', 'Fruits frais', 'Protéines maigres',
                    'Céréales complètes', 'Légumineuses', 'Noix et graines (avec modération)',
                    'Poissons gras', 'Œufs', 'Produits laitiers allégés'
                ]),
                'avoid_foods' => json_encode([
                    'Aliments transformés', 'Fast-food', 'Boissons sucrées',
                    'Pâtisseries', 'Confiseries', 'Aliments frits',
                    'Charcuteries', 'Fromages gras', 'Sauces industrielles'
                ]),
                'additional_advice' => 'Pratiquer une activité physique régulière. Boire beaucoup d\'eau. Contrôler les portions.'
            ],

            // 6. Cancer
            [
                'name' => 'Cancer',
                'slug' => Str::slug('Cancer'),
                'description' => 'Maladie caractérisée par la prolifération incontrôlée de cellules',
                'recommended_foods' => json_encode([
                    'Fruits et légumes colorés', 'Légumes crucifères (brocoli, chou)',
                    'Ail et oignon', 'Baies', 'Thé vert', 'Poissons gras',
                    'Céréales complètes', 'Légumineuses', 'Noix et graines',
                    'Curcuma'
                ]),
                'avoid_foods' => json_encode([
                    'Viandes transformées', 'Aliments carbonisés', 'Alcool',
                    'Aliments très salés', 'Sucre raffiné', 'Graisses trans',
                    'Produits laitiers en excès'
                ]),
                'additional_advice' => 'Maintenir un poids santé. Privilégier les aliments riches en antioxydants. Adapter selon le type de cancer et le traitement.'
            ],

            // 7. Maladies cardiovasculaires
            [
                'name' => 'Maladies cardiovasculaires',
                'slug' => Str::slug('Maladies cardiovasculaires'),
                'description' => 'Affections touchant le cœur et les vaisseaux sanguins',
                'recommended_foods' => json_encode([
                    'Poissons gras', 'Noix', 'Graines de lin', 'Avoine',
                    'Légumes verts', 'Fruits rouges', 'Huile d\'olive',
                    'Avocat', 'Légumineuses', 'Chocolat noir (>70%)'
                ]),
                'avoid_foods' => json_encode([
                    'Graisses trans', 'Viandes grasses', 'Produits laitiers entiers',
                    'Aliments frits', 'Aliments transformés', 'Excès de sel',
                    'Alcool', 'Sucre ajouté'
                ]),
                'additional_advice' => 'Limiter les graisses saturées. Augmenter les oméga-3. Maintenir une activité physique régulière.'
            ],

            // 8. Maladies rénales
            [
                'name' => 'Maladies rénales',
                'slug' => Str::slug('Maladies rénales'),
                'description' => 'Affections touchant les reins',
                'recommended_foods' => json_encode([
                    'Chou-fleur', 'Ail', 'Oignons', 'Poivrons rouges',
                    'Pommes', 'Canneberges', 'Poissons', 'Blanc d\'œuf',
                    'Huile d\'olive'
                ]),
                'avoid_foods' => json_encode([
                    'Aliments riches en potassium (bananes, oranges)',
                    'Aliments riches en phosphore (produits laitiers)',
                    'Excès de protéines', 'Aliments transformés',
                    'Excès de sel', 'Alcool'
                ]),
                'additional_advice' => 'Contrôler l\'apport en protéines, potassium et phosphore selon le stade de la maladie.'
            ],

            // 9. Maladies du foie
            [
                'name' => 'Maladies du foie',
                'slug' => Str::slug('Maladies du foie'),
                'description' => 'Affections hépatiques (stéatose, cirrhose, hépatite)',
                'recommended_foods' => json_encode([
                    'Légumes crucifères', 'Betteraves', 'Carottes', 'Noix',
                    'Avocat', 'Pommes', 'Céréales complètes', 'Poissons maigres',
                    'Huile d\'olive'
                ]),
                'avoid_foods' => json_encode([
                    'Alcool', 'Aliments gras', 'Aliments frits', 'Sucre ajouté',
                    'Sel en excès', 'Viandes transformées', 'Glucides raffinés'
                ]),
                'additional_advice' => 'Éviter strictement l\'alcool. Maintenir un poids santé. Boire beaucoup d\'eau.'
            ],

            // 10. Maladies auto-immunes
            [
                'name' => 'Maladies auto-immunes',
                'slug' => Str::slug('Maladies auto-immunes'),
                'description' => 'Affections où le système immunitaire attaque l\'organisme',
                'recommended_foods' => json_encode([
                    'Poissons gras', 'Légumes colorés', 'Fruits',
                    'Noix et graines', 'Huile d\'olive', 'Curcuma',
                    'Gingembre', 'Ail', 'Aliments fermentés'
                ]),
                'avoid_foods' => json_encode([
                    'Gluten', 'Produits laitiers', 'Sucre raffiné',
                    'Aliments transformés', 'Graisses trans', 'Alcool',
                    'Excès de café'
                ]),
                'additional_advice' => 'Adapter selon la maladie spécifique. Essayer un régime anti-inflammatoire.'
            ],

            // 11. Maladies neurologiques (Alzheimer, Parkinson)
            [
                'name' => 'Maladies neurologiques',
                'slug' => Str::slug('Maladies neurologiques'),
                'description' => 'Affections touchant le système nerveux',
                'recommended_foods' => json_encode([
                    'Poissons gras', 'Noix', 'Baies', 'Légumes verts',
                    'Curcuma', 'Huile d\'olive', 'Œufs', 'Chocolat noir',
                    'Graines de lin'
                ]),
                'avoid_foods' => json_encode([
                    'Aliments transformés', 'Sucre ajouté', 'Graisses trans',
                    'Excès d\'alcool', 'Glucides raffinés'
                ]),
                'additional_advice' => 'Privilégier les aliments riches en oméga-3 et antioxydants. Maintenir une activité physique et cognitive.'
            ],

            // 12. Arthrite et rhumatismes
            [
                'name' => 'Arthrite',
                'slug' => Str::slug('Arthrite'),
                'description' => 'Inflammation des articulations',
                'recommended_foods' => json_encode([
                    'Poissons gras', 'Noix', 'Graines de lin', 'Huile d\'olive',
                    'Cerises', 'Brocoli', 'Épinards', 'Gingembre', 'Curcuma'
                ]),
                'avoid_foods' => json_encode([
                    'Sucre ajouté', 'Glucides raffinés', 'Graisses trans',
                    'Excès d\'alcool', 'Viandes rouges transformées',
                    'Aliments frits'
                ]),
                'additional_advice' => 'Adopter un régime anti-inflammatoire. Maintenir un poids santé pour réduire la pression sur les articulations.'
            ],

            // 13. Ostéoporose
            [
                'name' => 'Ostéoporose',
                'slug' => Str::slug('Ostéoporose'),
                'description' => 'Fragilisation des os',
                'recommended_foods' => json_encode([
                    'Produits laitiers', 'Légumes verts', 'Amandes',
                    'Sardines', 'Saumon', 'Tofu', 'Haricots blancs',
                    'Figues séchées', 'Aliments enrichis en calcium'
                ]),
                'avoid_foods' => json_encode([
                    'Excès de sel', 'Alcool', 'Café en excès',
                    'Boissons gazeuses', 'Aliments riches en oxalates (épinards crus)'
                ]),
                'additional_advice' => 'Assurer un apport suffisant en calcium et vitamine D. Pratiquer des exercices de port de poids.'
            ],

            // 14. Anémie
            [
                'name' => 'Anémie',
                'slug' => Str::slug('Anémie'),
                'description' => 'Carence en globules rouges ou en hémoglobine',
                'recommended_foods' => json_encode([
                    'Viandes rouges maigres', 'Abats', 'Poissons',
                    'Légumineuses', 'Épinards', 'Céréales enrichies',
                    'Fruits secs', 'Noix', 'Graines'
                ]),
                'avoid_foods' => json_encode([
                    'Thé et café pendant les repas', 'Aliments riches en calcium pendant les repas',
                    'Alcool', 'Aliments pauvres en nutriments'
                ]),
                'additional_advice' => 'Associer les sources de fer avec des aliments riches en vitamine C pour améliorer l\'absorption.'
            ],

            // 15. Maladies thyroïdiennes
            [
                'name' => 'Maladies thyroïdiennes',
                'slug' => Str::slug('Maladies thyroïdiennes'),
                'description' => 'Affections touchant la thyroïde (hypo/hyperthyroïdie)',
                'recommended_foods' => json_encode([
                    'Poissons et fruits de mer', 'Noix du Brésil',
                    'Graines', 'Œufs', 'Légumes cuits', 'Fruits',
                    'Viandes maigres', 'Huile de coco'
                ]),
                'avoid_foods' => json_encode([
                    'Soja', 'Choux crus', 'Brocolis crus', 'Choux de Bruxelles crus',
                    'Excès de fibres', 'Alcool', 'Café en excès'
                ]),
                'additional_advice' => 'Adapter selon le type de trouble thyroïdien. Prendre les médicaments thyroïdiens à jeun.'
            ],

            // 16. Maladies intestinales (Crohn, côlon irritable)
            [
                'name' => 'Maladies intestinales',
                'slug' => Str::slug('Maladies intestinales'),
                'description' => 'Affections inflammatoires de l\'intestin',
                'recommended_foods' => json_encode([
                    'Bananes', 'Riz blanc', 'Compote de pommes', 'Toasts',
                    'Patates douces', 'Carottes cuites', 'Viandes maigres',
                    'Poissons', 'Yaourt nature'
                ]),
                'avoid_foods' => json_encode([
                    'Aliments riches en fibres insolubles', 'Aliments gras',
                    'Produits laitiers (si intolérance)', 'Alcool', 'Café',
                    'Aliments épicés', 'Aliments transformés'
                ]),
                'additional_advice' => 'Fractionner les repas. Tenir un journal alimentaire pour identifier les déclencheurs.'
            ],

            // 17. Goutte
            [
                'name' => 'Goutte',
                'slug' => Str::slug('Goutte'),
                'description' => 'Arthrite inflammatoire due à l\'accumulation d\'acide urique',
                'recommended_foods' => json_encode([
                    'Cerises', 'Fruits riches en vitamine C', 'Légumes',
                    'Céréales complètes', 'Produits laitiers allégés',
                    'Œufs', 'Café (avec modération)', 'Eau en abondance'
                ]),
                'avoid_foods' => json_encode([
                    'Viandes rouges', 'Abats', 'Fruits de mer',
                    'Alcool (surtout bière)', 'Boissons sucrées',
                    'Asperges', 'Champignons', 'Épinards'
                ]),
                'additional_advice' => 'Boire beaucoup d\'eau pour éliminer l\'acide urique. Maintenir un poids santé.'
            ]
        ];

        // Insérer les données dans la table
        foreach ($conditions as $condition) {
            DB::table('health_conditions')->insert($condition);
        }
        
        $this->command->info('17 conditions médicales avec recommandations alimentaires ont été insérées !');
    }
}