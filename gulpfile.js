'use strict';

// Компоненты
let Path = require('path');
let Del = require('del');
let MergeStream = require('merge-stream');
let Gulp = require('gulp');
let GTwig = require('gulp-twig');
let GSass = require('gulp-sass');
let GImagemin = require('gulp-imagemin');
let GRename = require('gulp-rename');
let GSassVariables = require('gulp-sass-variables');

// Переменные
/**
 * Символьный тип текущей среды (production|development)
 * @type {string}
 */
const NODE_ENV = process.argv.indexOf('-p') > 0 ? 'production' : 'development';
/**
 * Уровень оптимизации изображений
 * @type {number}
 */
const IMAGE_OPTIMIZATION_LEVEL = 3;
/**
 * Использовать метод оптимизации - Progressive
 * @type {boolean}
 */
const IMAGE_OPTIMIZATION_PROGRESSIVE = true;
/**
 * Использовать метод оптимизации - Interlaced
 * @type {boolean}
 */
const IMAGE_OPTIMIZATION_INTERLACED = true;
/**
 * Карта используемых имен директорий
 * @type {Object.<string, string>}
 */
const DIR_NAME_MAP = {
    BOWER: 'bower_components',
    FONT_AWESOME: 'font-awesome',
    VENDOR: 'vendor',
    SRC: 'src',
    APP: 'app',
    ASSETS: 'assets',
    IMAGES: 'images',
    FONTS: 'fonts',
    MODULES: 'components',
};
/**
 * Карта путей
 * @type {Object.<string, string>}
 */
const PATH_MAP = {
    ROOT: Path.resolve(__dirname),
    SRC: Path.resolve(DIR_NAME_MAP.SRC),
    APP: Path.resolve(DIR_NAME_MAP.APP),
    BOWER: Path.resolve(DIR_NAME_MAP.BOWER),
};

// Генерируем дополнительные пути
PATH_MAP.ASSETS = Path.join(PATH_MAP.APP, DIR_NAME_MAP.ASSETS);
PATH_MAP.IMAGES = Path.join(PATH_MAP.ASSETS, DIR_NAME_MAP.IMAGES);
PATH_MAP.FONTS = Path.join(PATH_MAP.ASSETS, DIR_NAME_MAP.FONTS);

/**
 * Карта используемых файлов и их псевдонимов
 * @type {Object.<string, string[]>}
 */
const FILE_MAP = {
    MAIN_STYLE: ['main.scss', 'app.css', PATH_MAP.ASSETS],
    MAIN_SCRIPT: ['main.js', 'app.js', PATH_MAP.ASSETS],
    MAIN_TEMPLATE: ['main.twig', 'index.html', PATH_MAP.ROOT],
    IMAGES: [
        [
            Path.join(PATH_MAP.SRC, DIR_NAME_MAP.MODULES, '**', DIR_NAME_MAP.IMAGES, '**', '*'),
            Path.join(DIR_NAME_MAP.SRC, DIR_NAME_MAP.MODULES, '**'),
            PATH_MAP.IMAGES
        ]
    ],
    FONTS: [
        [
            Path.join(PATH_MAP.SRC, DIR_NAME_MAP.MODULES, '**', DIR_NAME_MAP.FONTS, '**', '*'),
            Path.join(DIR_NAME_MAP.SRC, DIR_NAME_MAP.MODULES, '**'),
            PATH_MAP.FONTS
        ],
        [
            Path.join(PATH_MAP.BOWER, DIR_NAME_MAP.FONT_AWESOME, DIR_NAME_MAP.FONTS, '*'),
            Path.join(DIR_NAME_MAP.BOWER, DIR_NAME_MAP.FONT_AWESOME, '**'),
            Path.join(PATH_MAP.ASSETS, DIR_NAME_MAP.VENDOR, DIR_NAME_MAP.FONTS),
        ]
    ]
};

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
                            env: NODE_ENV,
                            path: {
                                assets: Path.join(DIR_NAME_MAP.APP, DIR_NAME_MAP.ASSETS)
                            }
                        }
                    }
                }))
                .pipe(GRename(FILE_MAP.MAIN_TEMPLATE[1]))
                .pipe(Gulp.dest(FILE_MAP.MAIN_TEMPLATE[2]));
        }
    )
    // Компиляция стилей
    .task(
        'compile-style',
        function ()
        {
            return Gulp
                .src(Path.join(PATH_MAP.SRC, FILE_MAP.MAIN_STYLE[0]))
                .pipe(GSassVariables({
                    $env: NODE_ENV
                }))
                .pipe(GSass().on('error', GSass.logError))
                .pipe(GRename(FILE_MAP.MAIN_STYLE[1]))
                .pipe(Gulp.dest(FILE_MAP.MAIN_STYLE[2]));
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
                .pipe(Gulp.dest(FILE_MAP.MAIN_SCRIPT[2]));
        }
    )
    // Копирования шрифтов
    .task(
        'copy-fonts',
        function()
        {
            let stream = MergeStream();

            FILE_MAP.FONTS.forEach(function(fileMap) {
                stream.add(
                    Gulp
                        .src(fileMap[0], { base: fileMap[1] })
                        .pipe(Gulp.dest(fileMap[2]))
                );
            });

            return stream;
        }
    )
    // Копирования изображений
    .task(
        'copy-images',
        function()
        {
            let stream = MergeStream();

            FILE_MAP.IMAGES.forEach(function(fileMap) {
                stream.add(
                    Gulp
                        .src(fileMap[0], { base: fileMap[1] })
                        .pipe(GImagemin({
                            optimizationLevel: IMAGE_OPTIMIZATION_LEVEL,
                            progressive: IMAGE_OPTIMIZATION_PROGRESSIVE,
                            interlaced: IMAGE_OPTIMIZATION_INTERLACED
                        }))
                        .pipe(Gulp.dest(fileMap[2]))
                );
            });

            return stream;
        }
    );

// Отслеживание изменений файлов приложения
Gulp
    .task(
        'watch',
        function ()
        {
            Gulp.watch(Path.join(PATH_MAP.SRC, '**', '*.js'), ['compile-script']);
            Gulp.watch(Path.join(PATH_MAP.SRC, '**', '*.scss'), ['compile-style']);
            Gulp.watch(Path.join(PATH_MAP.SRC, '**', '*.twig'), ['compile-template']);
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