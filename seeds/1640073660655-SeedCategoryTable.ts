import { DataSource, MigrationInterface, QueryRunner } from 'typeorm';
import Category from '@models/Category';
import { colorCodeGenerator } from '@utils';

const CATEGORIES = [
    {
        icon: 'baby',
        name: 'Kids',
    },
    {
        icon: 'theater-masks',
        name: 'Entertainment',
    },
    {
        icon: 'laptop-house',
        name: 'Utilities',
    },
    {
        icon: 'first-aid',
        name: 'Health',
    },
    {
        icon: 'hand-holding-usd',
        name: 'Salary',
    },
    {
        icon: 'shopping-basket',
        name: 'Grocery',
    },
    {
        icon: 'couch',
        name: 'Furniture',
    },
    {
        icon: 'car-side',
        name: 'Vehicle',
    },
    {
        icon: 'ellipsis-h',
        name: 'Others',
    },
    {
        icon: 'suitcase-rolling',
        name: 'Vacation',
    },
    {
        icon: 'tshirt',
        name: 'Clothes',
    },
    {
        icon: 'comment-dollar',
        name: 'Bonus',
    },
    {
        icon: 'percentage',
        name: 'Commission',
    },
    {
        icon: 'hand-holding-usd',
        name: 'Allowance',
    },
    {
        icon: 'business-time',
        name: 'Business',
    },
    {
        icon: 'house-user',
        name: 'Rental',
    },
    {
        icon: 'gifts',
        name: 'Gifts',
    },
    {
        icon: 'search-dollar',
        name: 'Interest',
    },
    {
        icon: 'file-invoice-dollar',
        name: 'Borrowing',
    },
    {
        icon: 'money-check',
        name: 'Expenses',
    },
    {
        icon: 'boxes',
        name: 'Utility Items',
    },
    {
        icon: 'handshake',
        name: 'Payment on behalf',
    },
    {
        icon: 'comments-dollar',
        name: 'Lending',
    },
    {
        icon: 'home',
        name: 'House',
    },
    {
        icon: 'house-user',
        name: 'Mortgage',
    },
    {
        icon: 'house-damage',
        name: 'Household repairs',
    },
    {
        icon: 'file-invoice-dollar',
        name: 'Management Fees',
    },
    {
        icon: 'percentage',
        name: 'Property Tax',
    },
    {
        icon: 'bus',
        name: 'Transportation',
    },
    {
        icon: 'gas-pump',
        name: 'Fuel',
    },
    {
        icon: 'dot-circle',
        name: 'Tires',
    },
    {
        icon: 'toolbox',
        name: 'Maintenance',
    },
    {
        icon: 'oil-can',
        name: 'Oil changes',
    },
    {
        icon: 'tools',
        name: 'Repairs',
    },
    {
        icon: 'edit',
        name: 'Registration',
    },
    {
        icon: 'bug',
        name: 'Inspection',
    },
    {
        icon: 'comment-dollar',
        name: 'Road Tax',
    },
    {
        icon: 'utensils',
        name: 'Food',
    },
    {
        icon: 'utensils',
        name: 'Restaurant',
    },
    {
        icon: 'paw',
        name: 'Pet food',
    },
    {
        icon: 'bolt',
        name: 'Electricity',
    },
    {
        icon: 'gas-pump',
        name: 'Gas',
    },
    {
        icon: 'trash-alt',
        name: 'Garbage',
    },
    {
        icon: 'mobile-alt',
        name: 'Phones',
    },
    {
        icon: 'ethernet',
        name: 'Cable',
    },
    {
        icon: 'network-wired',
        name: 'Internet',
    },
    {
        icon: 'pills',
        name: 'Medications',
    },
    {
        icon: 'briefcase-medical',
        name: 'Medical',
    },
    {
        icon: 'pump-medical',
        name: 'Hygienic',
    },
    {
        icon: 'laptop-medical',
        name: 'Insurance',
    },
    {
        icon: 'toilet-paper',
        name: 'Toiletries',
    },
    {
        icon: 'tshirt',
        name: 'Laundry',
    },
    {
        icon: 'air-freshener',
        name: 'Detergent',
    },
    {
        icon: 'dumbbell',
        name: 'Gym',
    },
    {
        icon: 'user',
        name: 'Haircuts',
    },
    {
        icon: 'magic',
        name: 'Cosmetics',
    },
    {
        icon: 'baby',
        name: 'Babysitter',
    },
    {
        icon: 'gem',
        name: 'Jewelry',
    },
    {
        icon: 'hand-holding-usd',
        name: 'Investment',
    },
    {
        icon: 'school',
        name: 'Education',
    },
    {
        icon: 'book',
        name: 'Books',
    },
    {
        icon: 'piggy-bank',
        name: 'Savings',
    },
    {
        icon: 'piggy-bank',
        name: 'Emergency fund',
    },
    {
        icon: 'birthday-cake',
        name: 'Birthday',
    },
    {
        icon: 'birthday-cake',
        name: 'Anniversary',
    },
    {
        icon: 'ring',
        name: 'Wedding',
    },
    {
        icon: 'hand-holding-heart',
        name: 'Charities',
    },
    {
        icon: 'glass-martini',
        name: 'Alcohol / bars',
    },
    {
        icon: 'gamepad',
        name: 'Games',
    },
    {
        icon: 'ticket-alt',
        name: 'Movies',
    },
    {
        icon: 'comment-dots',
        name: 'Concerts',
    },
    {
        icon: 'parking',
        name: 'Parks',
    },
    {
        icon: 'circle-notch',
        name: 'Subscriptions',
    },
];

export class SeedCategoryTable1640073660655 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const repository = queryRunner.connection.getRepository(Category);
        const now = new Date().getTime();
        const categories = CATEGORIES.map((category, index) => ({
            ...category,
            color: colorCodeGenerator(),
            sort: index,
            createdAt: now,
            updatedAt: now,
        }));
        await repository.save(categories);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
