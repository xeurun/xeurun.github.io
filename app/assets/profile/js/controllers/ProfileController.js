"use strict";

function ProfileController ()
{
    let
        expand = false;

    this.isExpand = function ()
    {
        return expand;
    };

    this.setExpand = function (value)
    {
        if (value !== undefined) {
            expand = value;
        } else {
            expand = !expand;
        }
    }
}

angular.module('app').controller('ProfileController', ProfileController);