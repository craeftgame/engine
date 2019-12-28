/* globals describe, test, expect */
import WeaponCraefter from "../weaponcraefter"
import {
    ResourceTypes,
    Unknown,
    WeaponTypes
} from "../../data/types";
import Resources from "../../resources";

describe("WeaponCraefter", () => {
    describe("evaluateItem", () => {

        describe("Staff", () => {

            test("should return item type wand if only wood", () => {
                const craefter = new WeaponCraefter();

                const resources = new Resources();
                resources[ResourceTypes.Wood] = 100;

                const item = craefter.evaluateItem({resources});

                expect(item.type).toBe(WeaponTypes.Staff)
            });

        });

        describe("Sword", () => {

            test("should return item type sword if only metal", () => {
                const weaponCraefter = new WeaponCraefter();

                const resources = new Resources();
                resources[ResourceTypes.Metal] = 100;
                const item = weaponCraefter.evaluateItem({resources});

                expect(item.type).toBe(WeaponTypes.Sword)
            });

            test("should return item type sword if metal is way larger than wood", () => {
                const weaponCraefter = new WeaponCraefter();

                const resources = new Resources();
                resources[ResourceTypes.Metal] = 100;
                resources[ResourceTypes.Wood] = 20;
                const item = weaponCraefter.evaluateItem({resources});

                expect(item.type).toBe(WeaponTypes.Sword)
            });

        });

        describe("Knife", () => {

            test("should return item type knife if metal is a little bit larger than wood", () => {
                const weaponCraefter = new WeaponCraefter();

                const resources = new Resources();
                resources[ResourceTypes.Metal] = 30;
                resources[ResourceTypes.Wood] = 20;
                const item = weaponCraefter.evaluateItem({resources});

                expect(item.type).toBe(WeaponTypes.Knife)
            });

        });

        describe("JewelSword", () => {

            test("make jewel sword", () => {
                const weaponCraefter = new WeaponCraefter();

                const resources = new Resources();
                resources[ResourceTypes.Metal] = 5;
                resources[ResourceTypes.Wood] = 2;
                resources[ResourceTypes.Diamond] = 11;

                const item = weaponCraefter.evaluateItem({resources});

                console.log(item.type, WeaponTypes.JewelSword);

                expect(item.type).toBe(WeaponTypes.JewelSword)
            });

        });

        describe("JewelKnife", () => {

            test("make jewel knife", () => {
                const weaponCraefter = new WeaponCraefter();

                const resources = new Resources();
                resources[ResourceTypes.Metal] = 5;
                resources[ResourceTypes.Wood] = 5;
                resources[ResourceTypes.Diamond] = 11;

                const item = weaponCraefter.evaluateItem({resources});

                expect(item.type).toBe(WeaponTypes.JewelKnife)
            });

        });

        describe("JewelWand", () => {

            test("make jewel wand", () => {
                const weaponCraefter = new WeaponCraefter();

                const resources = new Resources();
                resources[ResourceTypes.Wood] = 5;
                resources[ResourceTypes.Diamond] = 11;

                const item = weaponCraefter.evaluateItem({resources});

                expect(item.type).toBe(WeaponTypes.JewelWand)
            });

        });

        describe("mysterious", () => {

            test("Should create", () => {
                const weaponCraefter = new WeaponCraefter();

                const resources = new Resources();
                resources[ResourceTypes.Diamond] = 50;

                const item = weaponCraefter.evaluateItem({resources});

                expect(item.type).toBe(Unknown)
            });

        })

    });
});