"use strict";

function SocialController (CrawlerService, FileProvider)
{
    let
        links = [];

    this.loadLinks = function()
    {
        links = CrawlerService.get(
            FileProvider.get,
            {
                'entity': 'link'
            }
        );
    };

    this.getLinks = function()
    {
        return links;
    };
}

angular.module('app').controller('SocialController', SocialController);