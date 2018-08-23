"use strict";

function PortfolioController (CrawlerService, FakeProvider)
{
    let
        projects = [];

    this.loadProjects = function()
    {
        projects = CrawlerService.get(
            FakeProvider.get,
            {
                'entity': 'project'
            }
        );
    };

    this.getProjects = function()
    {
        return projects;
    };
}

angular.module('app').controller('PortfolioController', PortfolioController);