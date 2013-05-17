Mojito Alter Mojit
==================

This mojit is an utility mojit that can be used to
control the execution workflow of a series of mojits that
might fail due to various reasons. When the first mojit from
the `alters` array fails, the next mojit will be executed as
an alternative option, and the same goes on until an action
success or no more mojits are defined in the `alters` list,
in which case the container fails by calling `ac.error()`.

Installation
------------

Install the `npm` package in your application folder:

```shell
$ cd path/to/app
$ npm install mojito-alter-mojit --save
```

_note: the `--save` flag indicates that the `package.json` for
the application should also register the `mojito-alter-mojit` as
a dependency._

Usage
-----

Once `mojito-alter-mojit` gets installed in your application, you
can start using it in your `application.json` thru the `specs` to
define a mojit instance:

```
{
    "specs": {
        "foo-or-bar-or-baz": {
            "type": "mojito-alter-mojit",
            "config": {
                "alters": [
                    {
                        "type": "foo",
                        "config": {}
                    },
                    {
                        "type": "bar",
                        "config": {}
                    },
                    {
                        "type": "baz",
                        "config": {}
                    }
                ]
            }
        }
    }
}
```

In the example above, `foo` instance will be executed first,
if it fails by calling `ac.error()` or by throwing an
error, `bar` will be executed next, and the same principle
applies. If `bar` and `baz` also fail, `ac.error()` will be
issued to finalize the execution of this mojit.

This mojit does not have view associated, and it will just
return the response from the success child when available.

License
-------

Copyright (c) 2013 Caridy Patino <caridy@gmail.com>.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.