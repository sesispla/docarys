/*jslint node: true */
"use strict";

var config = require("../src/config.js");
var expect = require("expect");
var path = require("path");
var getInstalledPath = require("get-installed-path");

describe("Configuration", function () {
    it("Should load default file", function () {
        var cfg = config();
        expect(cfg).toExist("Configuration object do not exist");
        expect(cfg.context).toExist("No configuration has been loaded from YAML file");
        expect(cfg.sourcePath).toBe(path.resolve(__dirname + "/docs"));
        expect(cfg.targetPath).toBe(path.resolve(__dirname + "/build"));
        expect(cfg.templatePath).toBe(getInstalledPath.sync("docarys-material") + "/build");
        expect(cfg.templatePath).toNotContain("undefined");
    });
    it("Should load custom file and properties", function () {
        var cfg = config("docarys.custom.yml");
        expect(cfg).toExist("Configuration object do not exist");
        expect(cfg.context["site_name"]).toBe("docarys2", "site_name should be \"docarys2\" in file docarys.custom.yml");
    });
    it("Should load pages if present", function() {
        var cfg = config("docarys.pagetree.yml");
        var pages = cfg.context["pages"];
        expect(pages).toExist("pages is set in docarys.pagetree.yml file, but it has not been loaded");
        var page = pages[0];
        expect(page["Home"]).toBe("index.md", "Page Home should be \"index.md\"");
        page = pages[1];
        expect(page["Level 1"]).toExist("Level 1 should present, containing child elements");
        var subpage = page["Level 1"][0];
        expect(subpage).toExist("Level 1 should contain a child");
        expect(subpage["Level 2"]).toBe("level1/index.md");
    });
    it("Should change templateDir if specified", function () {
        var cfg = config("docarys.theme_dir.yml");
        expect(cfg.context["theme_dir"]).toBe("custom", "site_name should be \"custom\" in file docarys.theme_dir.yml");
        expect(cfg.templatePath).toBe(cfg.cwdPath + "/custom");
    });
});