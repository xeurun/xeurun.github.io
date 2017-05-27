'use strict';

// Компоненты
let
    Path = require('path'),
    Del = require('del'),
    Gulp = require('gulp'),
    GTwig = require('gulp-twig'),
    GSass = require('gulp-sass'),
    GImagemin = require('gulp-imagemin'),
    GRename = require('gulp-rename');

// Переменные
const
    NODE_ENV = process.argv.indexOf('-p') ? 'production' : 'development',
    IMAGE_OPTIMIZATION_LEVEL = 3,
    IMAGE_OPTIMIZATION_PROGRESSIVE = true,
    IMAGE_OPTIMIZATION_INTERLACED = true,
    DIR_NAME_MAP = {
        SRC: 'src',
        APP: 'app',
        ASSETS: 'assets',
        IMAGES: 'images',
        FONTS: 'fonts',
        MODULES: 'components',
    },
    PATH_MAP = {
        ROOT: Path.resolve(__dirname),
        SRC: Path.resolve(DIR_NAME_MAP.SRC),
        APP: Path.resolve(DIR_NAME_MAP.APP)
    },
    FILE_MAP = {
        MAIN_STYLE: ['main.scss', 'app.css'],
        MAIN_SCRIPT: ['main.js', 'app.js'],
        MAIN_TEMPLATE: ['main.twig', 'index.html'],
        IMAGES: Path.join(PATH_MAP.SRC, DIR_NAME_MAP.MODULES, '**', DIR_NAME_MAP.IMAGES, '**', '*'),
        FONTS: Path.join(PATH_MAP.SRC, DIR_NAME_MAP.MODULES, '**', DIR_NAME_MAP.FONTS, '**', '*')
    };

PATH_MAP.ASSETS = Path.join(PATH_MAP.APP, DIR_NAME_MAP.ASSETS);
PATH_MAP.IMAGES = Path.join(PATH_MAP.ASSETS, DIR_NAME_MAP.IMAGES);
PATH_MAP.FONTS = Path.join(PATH_MAP.ASSETS, DIR_NAME_MAP.FONTS);

Gulp
    // Удаление всех подготовленных файлов приложения
    .task('clean', function() {
        return Del([PATH_MAP.APP]);
    })
    // Компиляция шаблона
    .task(
        'compile-template',
        function ()
        {
            return Gulp
                .src(Path.join(PATH_MAP.SRC, FILE_MAP.MAIN_TEMPLATE[0]))
                .pipe(GTwig({
                    data: {
                        me: 'Алексей Степанков',
                        position: 'Ведущий разработчик',
                        env: {
                            path: {
                                assets: Path.join(DIR_NAME_MAP.APP, DIR_NAME_MAP.ASSETS)
                            }
                        }
                    }
                }))
                .pipe(GRename(FILE_MAP.MAIN_TEMPLATE[1]))
                .pipe(Gulp.dest(PATH_MAP.ROOT));
        }
    )
    // Компиляция стилей
    .task(
        'compile-style',
        function ()
        {
            return Gulp
                .src(Path.join(PATH_MAP.SRC, FILE_MAP.MAIN_STYLE[0]))
                .pipe(GSass().on('error', GSass.logError))
                .pipe(GRename(FILE_MAP.MAIN_STYLE[1]))
                .pipe(Gulp.dest(PATH_MAP.ASSETS));
        }
    )
    // Компиляция скриптов
    .task(
        'compile-script',
        function ()
        {
            return Gulp
                .src(Path.join(PATH_MAP.SRC, FILE_MAP.MAIN_SCRIPT[0]))
                .pipe(GRename(FILE_MAP.MAIN_SCRIPT[1]))
                .pipe(Gulp.dest(PATH_MAP.ASSETS));
        }
    )
    // Копирования шрифтов
    .task(
        'copy-fonts',
        function()
        {
            return Gulp
                .src(FILE_MAP.FONTS, { base: Path.join(DIR_NAME_MAP.SRC, DIR_NAME_MAP.MODULES, '**') })
                .pipe(Gulp.dest(PATH_MAP.FONTS));
        }
    )
    // Копирования изображений
    .task(
        'copy-images',
        function()
        {
            return Gulp
                .src(FILE_MAP.IMAGES, { base: Path.join(DIR_NAME_MAP.SRC, DIR_NAME_MAP.MODULES, '**') })
                .pipe(GImagemin({
                    optimizationLevel: IMAGE_OPTIMIZATION_LEVEL,
                    progressive: IMAGE_OPTIMIZATION_PROGRESSIVE,
                    interlaced: IMAGE_OPTIMIZATION_INTERLACED
                }))
                .pipe(Gulp.dest(PATH_MAP.IMAGES));
        }
    );

// Отслеживание изменений файлов приложения
Gulp
    .task(
        'watch',
        function ()
        {
            Gulp.watch(Path.join(PATH_MAP.SRC, FILE_MAP.MAIN_TEMPLATE[0]), ['compile-template']);
            Gulp.watch(Path.join(PATH_MAP.SRC, FILE_MAP.MAIN_STYLE[0]), ['compile-style']);
            Gulp.watch(Path.join(PATH_MAP.SRC, FILE_MAP.MAIN_SCRIPT[0]), ['compile-script']);
        }
    );

// Копирование файлов приложения
Gulp
    .task(
        'copy',
        [
            'copy-images',
            'copy-fonts',
        ]
    );

// Компиляция приложения
Gulp
    .task(
        'compile',
        [
            'compile-template',
            'compile-style',
            'compile-script',
        ]
    );

// Команда по умолчанию
Gulp.task(
    'default',
    ['clean'],
    function ()
    {
        Gulp.start('copy');
        Gulp.start('compile');
    }
);