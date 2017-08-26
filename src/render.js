/*jslint node: true */
"use strict";

var fs = require("fs");
var fse = require("fs-extra");
var path = require("path");
var mkdirp = require("mkdirp");
var nunjucks = require("nunjucks");
var rimraf = require("rimraf");
var siteTree = require("./siteTree.js");

function Render(config) {

    nunjucks.configure(config.templatePath, {
        autoescape: false
    });

    function render () {
        var site = new siteTree(config);
        console.info("Cleaning site directory");
        rimraf.sync(config.targetPath);
        console.info("Building documentation to directory: '" + config.targetPath + "'");
        renderTheme(config.templatePath, config.targetPath);
        renderSite(site, site);
    }

    function renderTheme (templatePath, targetPath) {
        var opts = {
            filter: function (filename) {
                return !filename.endsWith('.html');
            }
        };

        fse.copySync(templatePath, targetPath, opts, function () {});
    }

    function renderSite (page, site) {
        if (page.url) { // Pages with no URL are SiteTree nodes grouping subitems, and should not be rendered
            var ctx = {
                config: config,
                page: page,
                nav: site
            };
            mkdirp.sync(path.dirname(page.targetFile));
            var html = nunjucks.render(page.templateFile, ctx);
            fs.writeFileSync(page.targetFile, html);
        }

        if (Array.isArray(page.children)) {
            for (var i = 0; i < page.children.length; i++) {
                renderSite(page.children[i], site);
            }
        }
    }

    return {
        render: render
    }
}

module.exports = Render;