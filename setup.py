try:
    from setuptools import setup
except ImportError:
    from distutils.core import setup

config = {
    'description': 'Tag Refinery',
    'author': 'Christoph Kral',
    'url': 'Christoph.github.io',
    'download_url': 'Github',
    'author_email': 'christoph.kralj@gmail.com',
    'version': '0.1',
    'install_requires': ['nose'],
    'packages': ['tagrefinery'],
    'scripts': [],
    'name': 'tagrefinery'
}

setup(**config)
